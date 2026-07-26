#!/usr/bin/env node
// doctor.mjs — verify the auto-loom environment before burning a render.
// Every failure prints the exact fix. Exit 0 only when everything passes.
//
// Usage:
//   node scripts/doctor.mjs [--env <envfile>] [--offline]

import { existsSync } from 'fs';
import { join } from 'path';
import { parseArgs, loadEnv, execAsync, SKILL_ROOT } from './lib.mjs';

const argv = parseArgs(process.argv.slice(2));
loadEnv({ envFlag: typeof argv['--env'] === 'string' ? argv['--env'] : undefined });
const offline = !!argv['--offline'];

let failures = 0;
let warnings = 0;

function pass(name, detail = '') { console.log(`  ok    ${name}${detail ? ` — ${detail}` : ''}`); }
function fail(name, fix) { failures++; console.log(`  FAIL  ${name}\n        fix: ${fix}`); }
function warn(name, note) { warnings++; console.log(`  warn  ${name} — ${note}`); }

console.log('auto-loom doctor\n');

// ── Node ──────────────────────────────────────────────────────────────────────
const major = parseInt(process.versions.node.split('.')[0], 10);
if (major >= 18) pass('node', `v${process.versions.node}`);
else fail(`node v${process.versions.node} is too old`, 'install Node 18+ (https://nodejs.org or `nvm install 18`)');

// ── ffmpeg / ffprobe ──────────────────────────────────────────────────────────
for (const tool of ['ffmpeg', 'ffprobe']) {
  try {
    await execAsync(tool, ['-version']);
    pass(tool);
  } catch {
    fail(`${tool} not found on PATH`, 'brew install ffmpeg   (macOS) / apt install ffmpeg (Linux)');
  }
}

// ── Playwright + Chromium ─────────────────────────────────────────────────────
try {
  const { chromium } = await import('playwright');
  const execPath = chromium.executablePath();
  if (execPath && existsSync(execPath)) {
    pass('playwright + chromium');
  } else {
    fail('chromium browser not installed', `cd "${SKILL_ROOT}" && npx playwright install chromium`);
  }
} catch {
  fail('playwright not installed', `bash "${join(SKILL_ROOT, 'scripts/setup.sh')}"   (or: cd "${SKILL_ROOT}" && npm install)`);
}

// ── Env vars ──────────────────────────────────────────────────────────────────
const API_KEY  = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

if (!API_KEY || API_KEY === 'sk_your_key_here') {
  fail('ELEVENLABS_API_KEY not set', `copy "${join(SKILL_ROOT, '.env.example')}" to .env.local and add your key (free at elevenlabs.io → Profile → API Keys)`);
}
if (!VOICE_ID) {
  fail('ELEVENLABS_VOICE_ID not set', 'add it to .env.local — free premade voice IDs are listed in .env.example');
}

// ── ElevenLabs API reachability (catches bad key / paid-only voice up front) ──
if (API_KEY && API_KEY !== 'sk_your_key_here' && !offline) {
  try {
    const userRes = await fetch('https://api.elevenlabs.io/v1/user', { headers: { 'xi-api-key': API_KEY } });
    if (userRes.ok) {
      const user = await userRes.json();
      const sub = user.subscription ?? {};
      pass('ElevenLabs API key', `tier: ${sub.tier ?? 'unknown'}, ${sub.character_count ?? '?'}/${sub.character_limit ?? '?'} characters used`);
      if (VOICE_ID) {
        const voiceRes = await fetch(`https://api.elevenlabs.io/v1/voices/${VOICE_ID}`, { headers: { 'xi-api-key': API_KEY } });
        if (voiceRes.ok) {
          const voice = await voiceRes.json();
          const premade = voice.category === 'premade';
          if (!premade && (sub.tier === 'free' || !sub.tier)) {
            fail(`voice "${voice.name}" (${voice.category}) needs a paid plan on your free tier`, 'switch ELEVENLABS_VOICE_ID to a premade voice — IDs in .env.example');
          } else {
            pass('ElevenLabs voice', `${voice.name} (${voice.category})`);
          }
        } else {
          fail(`voice ID ${VOICE_ID} not reachable (HTTP ${voiceRes.status})`, 'check the ID, or switch to a premade voice from .env.example');
        }
      }
    } else if (userRes.status === 401) {
      fail('ElevenLabs rejected the API key (401)', 'regenerate the key at elevenlabs.io → Profile → API Keys and update .env.local');
    } else {
      warn('ElevenLabs API', `unexpected HTTP ${userRes.status} — may be transient`);
    }
  } catch (err) {
    warn('ElevenLabs API unreachable', `${err.message} — offline? re-run when connected (or pass --offline to skip)`);
  }
}

// ── Verdict ───────────────────────────────────────────────────────────────────
console.log('');
if (failures) {
  console.error(`DOCTOR: ${failures} failure(s), ${warnings} warning(s). Fix the items above, then re-run: node scripts/doctor.mjs`);
  process.exit(1);
}
console.log(`DOCTOR: all checks passed (${warnings} warning(s)). You are ready to record.`);
