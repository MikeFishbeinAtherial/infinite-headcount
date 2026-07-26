#!/usr/bin/env node
// render.mjs — drive a live web app with Playwright and record the screen.
//
// The recording context starts *after* login: auth (scripted steps or saved
// storageState) is established in a throwaway non-recorded context first, so
// the video contains only the beats and audio/video sync is exact from frame 0.
//
// Usage:
//   node scripts/render.mjs \
//     --beats <beats.json> \
//     --durations <outdir>/audio/durations.json \
//     --out <outdir>/video \
//     [--presenter ./assets/presenter.js] [--preflight] [--qa <outdir>/qa]
//
// --preflight: headless dry-run — navigates every page, resolves every
//   selector, prints a per-beat table. No recording, no audio needed.
//
// Prints:  VIDEO:<absolute-path-to-recording.webm>

import { readFileSync, mkdirSync, renameSync, existsSync } from 'fs';
import { resolve as absPath, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import {
  parseArgs, loadBeats, loadEnv, resolveEnvValue, globToRegExp, LOGIN_URL_RE,
} from './lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Args ─────────────────────────────────────────────────────────────────────

const argv          = parseArgs(process.argv.slice(2));
const beatsPath     = argv['--beats'] ?? './beats.json';
const durationsPath = argv['--durations'];
const outDir        = argv['--out'] ?? './out/video';
const presenterJs   = argv['--presenter'] ?? absPath(__dirname, '../assets/presenter.js');
const preflight     = !!argv['--preflight'];
const qaDir         = typeof argv['--qa'] === 'string' ? argv['--qa'] : null;

loadEnv({ envFlag: typeof argv['--env'] === 'string' ? argv['--env'] : undefined, beatsPath });

// ─── Load ─────────────────────────────────────────────────────────────────────

const { beats, baseUrl, viewport, storageState, loginDetect } = loadBeats(beatsPath);
const recordSize = { width: viewport.width, height: viewport.height };
const auth = normalizeAuth(loadBeats(beatsPath).auth);

if (!beats.length) { console.error('No beats found in', beatsPath); process.exit(1); }

let durations = beats.map(() => 5);
if (!preflight) {
  if (!durationsPath || !existsSync(durationsPath)) {
    console.error(`durations file not found: ${durationsPath ?? '(missing --durations)'} — run gen-audio.mjs first, or pass --preflight for a dry run.`);
    process.exit(1);
  }
  durations = JSON.parse(readFileSync(durationsPath, 'utf8'));
  if (durations.length !== beats.length) {
    console.error(`durations.json has ${durations.length} entries but the storyboard has ${beats.length} beats — re-run gen-audio.mjs against this beats file.`);
    process.exit(1);
  }
}

mkdirSync(outDir, { recursive: true });
if (qaDir) mkdirSync(qaDir, { recursive: true });

const loginDetectPattern = loginDetect ?? auth?.loginDetect;
const loginRe = loginDetectPattern ? new RegExp(loginDetectPattern, 'i') : LOGIN_URL_RE;
const firstUrl = targetUrl(beats.find(b => b.page)?.page ?? '/');

// ─── Launch ───────────────────────────────────────────────────────────────────

console.log(`Launching Chromium (${viewport.width}×${viewport.height})${preflight ? ' [preflight — headless, no recording]' : ''}...`);

const browser = await chromium.launch({
  headless: preflight,   // the visible window IS the recording surface
  args: ['--disable-infobars', '--no-first-run'],
});

// ─── Establish auth OUTSIDE the recorded context ─────────────────────────────

let sessionState = storageState;   // path or undefined

if (auth) {
  sessionState = await scriptedLogin();
} else if (storageState) {
  await verifySession(storageState);
}

// ─── Recording context ────────────────────────────────────────────────────────

const context = await browser.newContext({
  viewport,
  deviceScaleFactor: 1,
  storageState: sessionState,
  bypassCSP: true,   // strict-CSP sites would otherwise block presenter.js injection
  ...(preflight ? {} : {
    recordVideo: { dir: outDir, size: recordSize },
  }),
});

const page = await context.newPage();

// ─── Beat loop ────────────────────────────────────────────────────────────────

const preflightRows = [];
let currentUrl = null;
let preflightFailures = 0;

for (let i = 0; i < beats.length; i++) {
  const beat  = beats[i];
  const durMs = Math.round((durations[i] ?? 5) * 1000);
  const target = beat.page ? targetUrl(beat.page) : null;

  if (target && target !== currentUrl) {
    console.log(`Beat ${beat.id}: navigating to ${beat.page}`);
    await page.goto(target, { waitUntil: 'networkidle', timeout: 25_000 });
    await page.waitForTimeout(preflight ? 2_500 : 1_500);   // let client-rendered apps hydrate
    currentUrl = target;

    // Mid-run guard: a bounce to the login page means the session died.
    if (loginRe.test(page.url()) && !loginRe.test(target)) {
      await context.close(); await browser.close();
      failSession(`Beat ${beat.id} landed on a login page (${page.url()}) — the session expired mid-run.`);
    }
  }

  if (preflight) {
    for (const action of beat.actions ?? []) {
      const row = await checkAction(beat, action);
      if (row) { preflightRows.push(row); if (!row.ok) preflightFailures++; }
    }
    continue;
  }

  // Always re-inject presenter (guards against hot-reload clearing window state)
  await injectPresenter();

  const actions = beat.actions ?? [];
  console.log(`Beat ${beat.id}: ${actions.length} actions, ${(durMs / 1000).toFixed(1)}s`);

  // Spread actions across the first 55% of the beat's audio duration,
  // then hold the final highlighted state for the remaining 45%.
  const actionWindow = Math.floor(durMs * 0.55);
  const holdWindow   = durMs - actionWindow;
  const gapPerAction = actions.length > 1 ? Math.floor(actionWindow / actions.length) : actionWindow;

  for (let j = 0; j < actions.length; j++) {
    const action = actions[j];
    await runAction(action);
    if (j < actions.length - 1) await page.waitForTimeout(gapPerAction);
  }

  if (qaDir) {
    await page.screenshot({ path: join(qaDir, `beat-${String(beat.id).padStart(2, '0')}.png`) })
      .catch(err => console.warn(`  [warn] qa screenshot failed: ${err.message}`));
  }

  await page.waitForTimeout(holdWindow);
}

if (!preflight) await page.waitForTimeout(1_500);   // brief hold before closing

// ─── Finish ───────────────────────────────────────────────────────────────────

const videoPath = preflight ? null : await page.video()?.path();
await context.close();
await browser.close();

if (preflight) {
  console.log('\nPreflight results:');
  for (const row of preflightRows) {
    console.log(`  ${row.ok ? 'ok  ' : 'FAIL'}  beat ${row.beat}  ${row.fn}(${row.sel})  → ${row.note}`);
  }
  if (preflightFailures) {
    console.error(`\nPREFLIGHT FAILED: ${preflightFailures} unresolved selector(s). Fix the beats file before recording.`);
    process.exit(1);
  }
  console.log(`\nPREFLIGHT PASSED: ${preflightRows.length} selector checks across ${beats.length} beats.`);
  process.exit(0);
}

if (!videoPath) {
  console.error('No video was recorded. Check that recordVideo was configured correctly.');
  process.exit(1);
}

// Playwright names the webm with a hash; rename to a stable path so the mux
// step takes an exact file instead of a glob (stale-file footgun).
const finalPath = join(outDir, 'recording.webm');
renameSync(videoPath, finalPath);
console.log(`\nVIDEO:${absPath(finalPath)}`);

// ─── Auth helpers ─────────────────────────────────────────────────────────────

function normalizeAuth(rawAuth) {
  if (!rawAuth) return null;
  if (rawAuth.steps) return rawAuth;
  if (rawAuth.email !== undefined || rawAuth.password !== undefined) {
    // Legacy shape: {loginUrl, email, password} → v2 steps
    return {
      loginUrl: rawAuth.loginUrl ?? '/sign-in',
      steps: [
        { fill: '#email',    value: rawAuth.email },
        { fill: '#password', value: rawAuth.password },
        { click: 'button[type=submit]' },
      ],
      success: rawAuth.success ?? { urlGlob: '**/dashboard**' },
      loginDetect: rawAuth.loginDetect,
    };
  }
  return rawAuth;
}

// Log in inside a throwaway context, return the session as in-memory storage
// state for the recording context. The login never appears in the video.
async function scriptedLogin() {
  const loginUrl = auth.loginUrl?.startsWith('http') ? auth.loginUrl : baseUrl + (auth.loginUrl ?? '/sign-in');
  console.log(`Logging in at ${loginUrl} (not recorded)...`);
  const authContext = await browser.newContext({ viewport });
  const authPage = await authContext.newPage();
  try {
    await authPage.goto(loginUrl, { waitUntil: 'networkidle', timeout: 25_000 });
    for (const [i, step] of (auth.steps ?? []).entries()) {
      if (step.fill)  await authPage.fill(step.fill, resolveEnvValue(step.value, `auth step ${i + 1}`));
      if (step.click) await authPage.click(step.click);
      if (step.waitMs) await authPage.waitForTimeout(step.waitMs);
    }
    if (auth.success?.urlGlob) {
      await authPage.waitForURL(globToRegExp(auth.success.urlGlob), { timeout: 20_000 });
    } else if (auth.success?.sel) {
      await authPage.waitForSelector(auth.success.sel, { state: 'visible', timeout: 20_000 });
    } else {
      await authPage.waitForLoadState('networkidle');
      if (loginRe.test(authPage.url())) throw new Error(`still on a login-like URL after auth steps: ${authPage.url()}`);
    }
    await authPage.waitForLoadState('networkidle');
    console.log('Logged in.\n');
    const state = await authContext.storageState();
    await authContext.close();
    return state;
  } catch (err) {
    await authContext.close(); await browser.close();
    console.error(`\nLOGIN FAILED: ${err.message}`);
    console.error('Check the auth block in the beats file (selectors, env vars, success condition) — see references/auth.md.');
    process.exit(1);
  }
}

// Pre-check a user-supplied storageState before recording a single frame.
async function verifySession(statePath) {
  console.log('Verifying saved session (not recorded)...');
  const checkContext = await browser.newContext({ viewport, storageState: statePath });
  const checkPage = await checkContext.newPage();
  try {
    await checkPage.goto(firstUrl, { waitUntil: 'networkidle', timeout: 25_000 });
    if (loginRe.test(checkPage.url()) && !loginRe.test(firstUrl)) {
      await checkContext.close(); await browser.close();
      failSession(`Saved session is expired — ${firstUrl} redirected to ${checkPage.url()}.`, statePath);
    }
    console.log('Session OK.\n');
    await checkContext.close();
  } catch (err) {
    await checkContext.close(); await browser.close();
    console.error(`\nSESSION CHECK FAILED: ${err.message}`);
    process.exit(1);
  }
}

function failSession(reason, statePath) {
  console.error(`\n${reason}`);
  console.error('Re-capture the login session, then re-run:');
  console.error(`  npx playwright codegen --save-storage="${statePath ?? '<session-file>.json'}" ${firstUrl}`);
  console.error('(a browser opens — log in there, then close the window)');
  process.exit(1);
}

// ─── Page helpers ─────────────────────────────────────────────────────────────

function targetUrl(pagePath) {
  return pagePath.startsWith('http') ? pagePath : baseUrl + pagePath;
}

async function injectPresenter() {
  await page.addScriptTag({ path: presenterJs });
  const ok = await page.evaluate(() => typeof window.VCEPresent !== 'undefined');
  if (!ok) throw new Error('presenter.js failed to initialise on this page');
}

async function runAction(action) {
  const { fn, sel, opts, ms } = action;

  // Special cases handled directly by Playwright
  if (fn === 'wait') { await page.waitForTimeout(ms ?? 500); return null; }
  if (fn === 'waitFor') {
    await page.waitForSelector(sel, { state: 'visible', timeout: 10_000 })
      .catch(err => console.warn(`  [warn] waitFor(${sel}) timed out:`, err.message));
    return null;
  }
  if (fn === 'navigate') {
    await page.goto(targetUrl(sel), { waitUntil: 'networkidle', timeout: 20_000 });
    await page.waitForTimeout(1_200);
    await injectPresenter();
    return null;
  }

  // All other actions delegated to presenter.js — returns bounding rect when applicable
  try {
    return await page.evaluate(
      ({ fn, sel, opts }) => window.VCEPresent.exec({ fn, sel, opts }),
      { fn, sel: sel ?? null, opts: opts ?? null }
    );
  } catch (err) {
    console.warn(`  [warn] action ${fn}(${sel}) failed:`, err.message);
    return null;
  }
}

// Preflight: resolve one action's selector on the live page.
async function checkAction(beat, action) {
  const { fn, sel } = action;
  if (fn === 'wait') return null;
  if (fn === 'navigate') {
    try {
      await page.goto(targetUrl(sel), { waitUntil: 'networkidle', timeout: 20_000 });
      currentUrl = targetUrl(sel);
      return { beat: beat.id, fn, sel, ok: true, note: 'navigated' };
    } catch (err) {
      return { beat: beat.id, fn, sel, ok: false, note: `navigation failed: ${err.message}` };
    }
  }
  const sels = Array.isArray(sel) ? sel : [sel];
  for (const s of sels) {
    const count = await page.evaluate(sel => document.querySelectorAll(sel).length, s)
      .catch(() => -1);
    if (count === -1) return { beat: beat.id, fn, sel: s, ok: false, note: 'invalid selector syntax' };
    if (count === 0)  return { beat: beat.id, fn, sel: s, ok: false, note: 'no match on page' };
    if (count > 1 && fn !== 'hl' && fn !== 'unhl') {
      return { beat: beat.id, fn, sel: s, ok: true, note: `${count} matches — first will be used; tighten if wrong` };
    }
  }
  return { beat: beat.id, fn, sel: sels.join(', '), ok: true, note: 'unique match' };
}
