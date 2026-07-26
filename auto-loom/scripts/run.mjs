#!/usr/bin/env node
// run.mjs — the whole auto-loom pipeline in one command:
//   validate → gen-audio (cached) → preflight → render → captions → mux → verify
//
// Usage:
//   node scripts/run.mjs --beats <beats.json> \
//     [--out demo-video-out/<slug>] [--env <envfile>] \
//     [--script-only] [--skip-audio] [--skip-preflight] [--preflight-only] \
//     [--no-captions] [--burn-captions]
//
// --script-only: narrated mode only. Prints the full narration script (per-beat
// "text") and exits before any ElevenLabs call or recording — a hard review gate.
//
// Ends with a PASS/FAIL verification block and:  OUTPUT:<final.mp4>

import { readFileSync, existsSync, mkdirSync } from 'fs';
import { resolve as absPath, join } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import {
  parseArgs, loadEnv, loadBeats, slugFor, ffprobeDurationSeconds, execAsync,
} from './lib.mjs';
import { validateBeats } from './validate.mjs';

const SCRIPTS = absPath(fileURLToPath(import.meta.url), '..');

// ─── Args ─────────────────────────────────────────────────────────────────────

const argv = parseArgs(process.argv.slice(2));
const beatsPath = argv['--beats'];
if (!beatsPath) {
  console.error('Usage: node scripts/run.mjs --beats <beats.json> [--out <dir>] [--preflight-only] ...');
  process.exit(1);
}
const beatsAbs = absPath(beatsPath);
const envFlag  = typeof argv['--env'] === 'string' ? argv['--env'] : undefined;

loadEnv({ envFlag, beatsPath: beatsAbs });

const totalSteps = 6;

// ─── 1. Validate ──────────────────────────────────────────────────────────────

banner(`1/${totalSteps} validate`);
const { errors, warnings, normalized, stats } = validateBeats(beatsAbs);
for (const w of warnings) console.warn(`  [warn]  ${w}`);
for (const e of errors)   console.error(`  [error] ${e}`);
if (errors.length) {
  console.error(`\nFAIL: beats file has ${errors.length} error(s). Fix them and re-run.`);
  process.exit(1);
}
console.log(`  valid: ${stats.beats} beats, ${stats.totalWords} words (~${stats.estSeconds}s at 140 wpm)`);

const slug = slugFor(beatsAbs, normalized);
const outDir = absPath(typeof argv['--out'] === 'string' ? argv['--out'] : join('demo-video-out', slug));
mkdirSync(outDir, { recursive: true });
const audioDir = join(outDir, 'audio');
const videoDir = join(outDir, 'video');
const qaDir    = join(outDir, 'qa');
const finalMp4 = join(outDir, `${slug}-demo.mp4`);
const srtPath  = join(outDir, 'captions.srt');

// ─── Script review gate (narrated only) ────────────────────────────────────────
// Hard gate: before any ElevenLabs call, print the narration script (per-beat
// "text") and stop. Edit beats.json, re-run without --script-only to generate audio.

if (argv['--script-only']) {
  banner('SCRIPT REVIEW (dry run — no ElevenLabs call, no recording)');
  let totalWords = 0;
  normalized.beats.forEach((b, i) => {
    const text = (b.text ?? '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    totalWords += words;
    console.log(`\n  beat ${b.id ?? i + 1}  (~${(words / 140 * 60).toFixed(1)}s @140wpm)`);
    console.log(`    "${text || '(empty — no narration for this beat)'}"`);
  });
  console.log(`\n  total: ${totalWords} words, ~${(totalWords / 140 * 60).toFixed(1)}s of narration at 140wpm.`);
  console.log('\n  Edit the "text" field on any beat in the beats file to change the script.');
  console.log('  Re-run without --script-only to generate audio (ElevenLabs, cached by text hash) and record.');
  process.exit(0);
}

// Preflight checks selectors only. It must run before audio generation so this
// documented money-saving mode never calls ElevenLabs.
if (argv['--preflight-only']) {
  banner(`2/${totalSteps} audio — skipped (--preflight-only)`);
  banner(`3/${totalSteps} preflight (headless selector check — no recording)`);
  await step('node', [join(SCRIPTS, 'render.mjs'), '--beats', beatsAbs, '--preflight']);
  console.log('\nPreflight-only run complete. Re-run without --preflight-only to record.');
  process.exit(0);
}

// ─── 2. Audio ─────────────────────────────────────────────────────────────────

if (argv['--skip-audio']) {
  banner(`2/${totalSteps} audio — skipped (--skip-audio)`);
  if (!existsSync(join(audioDir, 'durations.json'))) {
    console.error(`FAIL: --skip-audio but no ${join(audioDir, 'durations.json')} exists from a previous run.`);
    process.exit(1);
  }
} else {
  banner(`2/${totalSteps} audio (ElevenLabs, cached by text hash)`);
  await step('node', [join(SCRIPTS, 'gen-audio.mjs'), '--beats', beatsAbs, '--out', audioDir]);
}

// ─── 3. Preflight ─────────────────────────────────────────────────────────────

if (argv['--skip-preflight']) {
  banner(`3/${totalSteps} preflight — skipped (--skip-preflight)`);
} else {
  banner(`3/${totalSteps} preflight (headless selector check — no recording)`);
  await step('node', [join(SCRIPTS, 'render.mjs'), '--beats', beatsAbs, '--preflight']);
}
// ─── 4. Record ────────────────────────────────────────────────────────────────

banner(`4/${totalSteps} record (Playwright self-recording — do not touch the browser window)`);
await step('node', [
  join(SCRIPTS, 'render.mjs'),
  '--beats', beatsAbs,
  '--durations', join(audioDir, 'durations.json'),
  '--out', videoDir,
  '--qa', qaDir,
]);
const webm = join(videoDir, 'recording.webm');
if (!existsSync(webm)) { console.error(`FAIL: expected ${webm} after render.`); process.exit(1); }

let captionsArg = [];
if (!argv['--no-captions']) {
  banner(`5/${totalSteps} captions + mux`);
  await step('node', [join(SCRIPTS, 'make-captions.mjs'), '--audio', audioDir, '--out', srtPath]);
  captionsArg = [srtPath];
} else {
  banner(`5/${totalSteps} mux (captions disabled)`);
}
await step('bash', [join(SCRIPTS, 'build-video.sh'), audioDir, webm, finalMp4, ...captionsArg], {
  env: { ...process.env, BURN: argv['--burn-captions'] ? '1' : '0' },
});

// ─── 6. Verify ────────────────────────────────────────────────────────────────

banner(`6/${totalSteps} verify`);
const durations = JSON.parse(readFileSync(join(audioDir, 'durations.json'), 'utf8'));
const narrationSec = durations.reduce((a, b) => a + b, 0);
const expected = narrationSec;
const actual = await ffprobeDurationSeconds(finalMp4);

const checks = [];
checks.push(check('duration', actual !== null && Math.abs(actual - expected) < 0.5,
  `mp4 ${actual?.toFixed(2)}s vs expected ${expected.toFixed(2)}s`));

let meanVol = null;
try {
  const { stderr } = await execAsync('ffmpeg', ['-i', finalMp4, '-af', 'volumedetect', '-f', 'null', '/dev/null']);
  meanVol = parseFloat(stderr.match(/mean_volume:\s*(-?[\d.]+)/)?.[1]);
} catch (err) {
  meanVol = parseFloat(String(err.stderr ?? '').match(/mean_volume:\s*(-?[\d.]+)/)?.[1]);
}
checks.push(check('audio level', meanVol !== null && !Number.isNaN(meanVol) && meanVol > -60,
  `mean_volume ${meanVol} dB (silent track ≈ -91)`));

checks.push(check('qa screenshots', existsSync(qaDir), `${qaDir} — compare each beat-NN.png against its narration`));

const failed = checks.filter(c => !c);
console.log('');
if (failed.length) {
  console.error(`FAIL: ${failed.length} verification check(s) failed. Inspect the output before sending.`);
  console.log(`OUTPUT:${finalMp4}`);
  process.exit(1);
}
console.log('PASS: all verification checks passed.');
console.log(`Contact sheet: ${finalMp4.replace(/\.mp4$/, '-contact-sheet.png')}`);
console.log(`OUTPUT:${finalMp4}`);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function banner(title) {
  console.log(`\n── ${title} ${'─'.repeat(Math.max(0, 60 - title.length))}`);
}

function check(name, ok, detail) {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name} — ${detail}`);
  return ok;
}

// Run a child step, streaming its output live. Rejects → exits with context.
function step(cmd, args, opts = {}) {
  return new Promise((resolveStep) => {
    const child = spawn(cmd, args, { stdio: 'inherit', ...opts });
    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`\nFAIL: step "${cmd} ${args[0]}" exited with code ${code}. See the messages above for the fix.`);
        process.exit(code ?? 1);
      }
      resolveStep();
    });
    child.on('error', (err) => {
      console.error(`\nFAIL: could not start "${cmd}": ${err.message}`);
      process.exit(1);
    });
  });
}
