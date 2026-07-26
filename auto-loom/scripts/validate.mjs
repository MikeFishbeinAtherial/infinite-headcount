#!/usr/bin/env node
// validate.mjs — validate a beats.json storyboard before spending ElevenLabs
// credits or render time. Structural checks + TTS/pacing lint, with
// beat-addressed error messages.
//
// Usage:
//   node scripts/validate.mjs --beats <file> [--quiet]
//
// Exit codes: 0 = valid (warnings allowed), 1 = errors found.
// Also importable: validateBeats(beatsPath) → { errors, warnings, normalized }

import { existsSync, readFileSync } from 'fs';
import { resolve as absPath, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parseArgs, loadBeats } from './lib.mjs';

const KNOWN_FNS = ['waitFor', 'wait', 'scrollToEl', 'hl', 'unhl', 'clickEl', 'expand', 'navigate'];
const SEL_REQUIRED = ['waitFor', 'scrollToEl', 'hl', 'clickEl', 'expand', 'navigate'];
const WPM_TARGET = 140;   // narration pace gen-audio produces at default settings
const WPM_MIN = 110;
const WPM_MAX = 170;

export function validateBeats(beatsPath) {
  const errors = [];
  const warnings = [];

  if (!existsSync(beatsPath)) {
    return { errors: [`beats file not found: ${beatsPath}`], warnings, normalized: null };
  }

  let normalized;
  try {
    normalized = loadBeats(beatsPath);
  } catch (err) {
    return { errors: [`beats file is not valid JSON: ${err.message}`], warnings, normalized: null };
  }

  const { raw, beats, auth, storageState, meta } = normalized;

  if (!beats.length) errors.push('no beats found — expected a top-level "beats" array with at least one beat');

  // Legacy / wrong-format detection
  if (!Array.isArray(raw)) {
    for (const key of Object.keys(raw)) {
      if (!['meta', 'baseUrl', 'viewport', 'storageState', 'auth', 'voice', 'cursor', 'loginDetect', 'beats'].includes(key)) {
        warnings.push(`unknown top-level key "${key}" — check schema/beats.schema.json`);
      }
    }
  }

  const seenIds = new Set();
  beats.forEach((beat, i) => {
    const label = `beat ${beat.id ?? i + 1}`;

    if (beat.id === undefined) errors.push(`${label}: missing "id"`);
    else if (seenIds.has(String(beat.id))) errors.push(`${label}: duplicate id — ids must be unique (they order the audio clips)`);
    seenIds.add(String(beat.id));

    if (!beat.text || !String(beat.text).trim()) {
      errors.push(`${label}: missing "text" — every beat needs a narration line`);
    }

    if (beat.browserActions) {
      errors.push(
        `${label}: uses prose "browserActions" — this format cannot be executed. ` +
        `Convert each step to an executable action, e.g. ` +
        `{"fn": "scrollToEl", "sel": "#pricing"} then {"fn": "hl", "sel": "#pricing"}. ` +
        `Allowed fns: ${KNOWN_FNS.join(', ')}.`
      );
    }

    (beat.actions ?? []).forEach((action, j) => {
      const aLabel = `${label}: action ${j + 1}`;
      if (!action.fn) { errors.push(`${aLabel}: missing "fn"`); return; }
      if (!KNOWN_FNS.includes(action.fn)) {
        const guess = closest(action.fn, KNOWN_FNS);
        errors.push(`${aLabel}: fn "${action.fn}" unknown${guess ? ` (did you mean "${guess}"?)` : ''}. Allowed: ${KNOWN_FNS.join(', ')}`);
      }
      if (SEL_REQUIRED.includes(action.fn) && !action.sel) {
        errors.push(`${aLabel}: fn "${action.fn}" requires "sel"`);
      }
      if (action.fn === 'wait' && action.ms === undefined) {
        warnings.push(`${aLabel}: "wait" without "ms" defaults to 500ms`);
      }
    });

    // ── TTS lint ──
    const text = String(beat.text ?? '');
    if (/—|–/.test(text)) {
      warnings.push(`${label}: narration contains an em/en dash — ElevenLabs pauses oddly on these; use a period instead`);
    }
    for (const sentence of text.split(/[.!?]+/)) {
      const words = sentence.trim().split(/\s+/).filter(Boolean);
      if (words.length > 25) {
        warnings.push(`${label}: sentence with ${words.length} words ("${words.slice(0, 5).join(' ')}…") — break it up; 10–20 words per sentence reads best`);
      }
    }
    const initialisms = text.match(/\b[A-Z]{2,5}s?\b/g) ?? [];
    for (const word of new Set(initialisms)) {
      if (/^[A-Z](-[A-Z])+s?$/.test(word)) continue; // already hyphen-spelled
      warnings.push(`${label}: bare initialism "${word}" — TTS mispronounces these; spell it with hyphens (e.g. "${word.split('').join('-')}")`);
    }
  });

  // ── Pacing lint against target length ──
  const totalWords = beats.reduce((sum, b) => sum + String(b.text ?? '').split(/\s+/).filter(Boolean).length, 0);
  const estSeconds = Math.round((totalWords / WPM_TARGET) * 60);
  if (meta.targetLengthSec) {
    const wpm = Math.round(totalWords / (meta.targetLengthSec / 60));
    if (wpm > WPM_MAX) {
      warnings.push(`pacing: ${totalWords} words in a ${meta.targetLengthSec}s target = ${wpm} wpm — too fast (max ~${WPM_MAX}). Cut narration or raise targetLengthSec. At ~${WPM_TARGET} wpm this script runs ~${estSeconds}s.`);
    } else if (wpm < WPM_MIN) {
      warnings.push(`pacing: ${totalWords} words in a ${meta.targetLengthSec}s target = ${wpm} wpm — the video will run short (~${estSeconds}s). Add narration or lower targetLengthSec.`);
    }
  }

  // ── Auth / storageState checks ──
  if (auth) {
    const legacy = auth.email !== undefined || auth.password !== undefined;
    if (legacy && auth.steps) errors.push('auth: has both legacy {email, password} and v2 "steps" — use one shape');
    if (!legacy && !auth.steps) errors.push('auth: needs either legacy {email, password} or v2 "steps" — see references/auth.md');
    if (legacy) {
      for (const field of ['email', 'password']) {
        const value = auth[field];
        if (value !== undefined && !String(value).startsWith('env:')) {
          warnings.push(`auth: legacy "${field}" inlines what looks like a credential — use "env:VAR_NAME" and put the value in .env.local`);
        }
      }
    }
    (auth.steps ?? []).forEach((step, i) => {
      if (!step.fill && !step.click && step.waitMs === undefined) {
        errors.push(`auth: step ${i + 1} does nothing — needs "fill"+"value", "click", or "waitMs"`);
      }
      if (step.fill && step.value === undefined) errors.push(`auth: step ${i + 1} has "fill" but no "value"`);
      if (step.value && !String(step.value).startsWith('env:') && /pass|secret|token/i.test(step.fill ?? '')) {
        warnings.push(`auth: step ${i + 1} inlines what looks like a credential — use "env:VAR_NAME" and put the value in .env.local`);
      }
    });
  }
  if (storageState && !existsSync(storageState)) {
    errors.push(
      `storageState file not found: ${storageState}\n` +
      `  Capture it with: npx playwright codegen --save-storage="${storageState}" <start-url>`
    );
  }

  return { errors, warnings, normalized, stats: { beats: beats.length, totalWords, estSeconds } };
}

function closest(input, candidates) {
  let best = null, bestDist = Infinity;
  for (const c of candidates) {
    const d = levenshtein(input.toLowerCase(), c.toLowerCase());
    if (d < bestDist) { bestDist = d; best = c; }
  }
  return bestDist <= 3 ? best : null;
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = parseArgs(process.argv.slice(2));
  const beatsPath = argv['--beats'];
  if (!beatsPath) { console.error('Usage: node scripts/validate.mjs --beats <file>'); process.exit(1); }

  const { errors, warnings, stats } = validateBeats(absPath(beatsPath));

  if (!argv['--quiet']) {
    for (const w of warnings) console.warn(`  [warn]  ${w}`);
  }
  for (const e of errors) console.error(`  [error] ${e}`);

  if (errors.length) {
    console.error(`\nINVALID: ${errors.length} error(s), ${warnings.length} warning(s) in ${beatsPath}`);
    process.exit(1);
  }
  console.log(`VALID: ${stats.beats} beats, ${stats.totalWords} words (~${stats.estSeconds}s at 140 wpm), ${warnings.length} warning(s)`);
}
