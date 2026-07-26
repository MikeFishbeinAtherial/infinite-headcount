#!/usr/bin/env node
// gen-audio.mjs — generate ElevenLabs voiceover clips from a beats.json file.
// Clips are cached by content hash: re-running after editing one beat's text
// regenerates only that beat.
//
// Usage:
//   ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... \
//   node scripts/gen-audio.mjs --beats <beats.json> --out <outdir>/audio [--force]

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { parseArgs, loadBeats, loadEnv, sha256, ffprobeDurationSeconds } from './lib.mjs';

// ─── Args / env ───────────────────────────────────────────────────────────────

const argv = parseArgs(process.argv.slice(2));
const beatsPath = argv['--beats'] ?? './beats.json';
const outDir    = argv['--out']   ?? './out/audio';
const force     = !!argv['--force'];

loadEnv({ envFlag: typeof argv['--env'] === 'string' ? argv['--env'] : undefined, beatsPath });

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('Missing ELEVENLABS_API_KEY. Copy .env.example to .env.local and fill it in, or export the variable.');
  process.exit(1);
}

// ─── Load beats ───────────────────────────────────────────────────────────────

const normalized = loadBeats(beatsPath);
const beats = normalized.beats;
if (!beats.length) { console.error('No beats found in', beatsPath); process.exit(1); }

// Per-file voice override beats env default
const VOICE_ID = normalized.voice.voiceId ?? process.env.ELEVENLABS_VOICE_ID;
const MODEL    = normalized.voice.model   ?? process.env.ELEVENLABS_MODEL ?? 'eleven_v3';
if (!VOICE_ID) {
  console.error('Missing voice: set ELEVENLABS_VOICE_ID or add {"voice": {"voiceId": "..."}} to the beats file.');
  process.exit(1);
}

const VOICE_SETTINGS = {
  stability: 0.5, similarity_boost: 0.8, style: 0.2,
  ...(normalized.voice.settings ?? {}),
};

mkdirSync(outDir, { recursive: true });

// ─── Cache: previous manifest keyed by beat id ────────────────────────────────

const manifestPath = join(outDir, 'manifest.json');
const prevById = new Map();
if (existsSync(manifestPath) && !force) {
  try {
    for (const entry of JSON.parse(readFileSync(manifestPath, 'utf8'))) {
      prevById.set(String(entry.id), entry);
    }
  } catch { /* corrupt manifest — regenerate everything */ }
}

function beatHash(text) {
  return sha256(JSON.stringify({ text, VOICE_ID, MODEL, VOICE_SETTINGS }));
}

// ─── Generate ─────────────────────────────────────────────────────────────────

const durations = [];
const manifest  = [];
let generated = 0, cached = 0;

for (const beat of beats) {
  const n       = String(beat.id).padStart(2, '0');
  const outPath = join(outDir, `beat-${n}.mp3`);
  const hash    = beatHash(beat.text);

  const prev = prevById.get(String(beat.id));
  if (prev && prev.textHash === hash && existsSync(outPath)) {
    durations.push(prev.duration);
    manifest.push({ ...prev, text: beat.text });
    cached++;
    console.log(`beat ${n}: cached (${prev.duration.toFixed(2)}s)`);
    continue;
  }

  process.stdout.write(`beat ${n}: generating... `);

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: beat.text, model_id: MODEL, voice_settings: VOICE_SETTINGS }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error(`\nElevenLabs error for beat ${n}:`, err);
    if (res.status === 402 || err.includes('payment_required')) {
      console.error('This voice requires a paid ElevenLabs plan. Switch to a free premade voice — see .env.example for IDs.');
    }
    if (res.status === 401) {
      console.error('The API key was rejected. Check ELEVENLABS_API_KEY in .env.local.');
    }
    process.exit(1);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buf);

  const dur = (await ffprobeDurationSeconds(outPath)) ?? (buf.length * 8) / (128 * 1000);
  durations.push(dur);
  manifest.push({ id: beat.id, file: `beat-${n}.mp3`, duration: dur, text: beat.text, textHash: hash });
  generated++;

  console.log(`${dur.toFixed(2)}s`);
}

// ─── Write outputs ────────────────────────────────────────────────────────────

writeFileSync(join(outDir, 'durations.json'), JSON.stringify(durations, null, 2));
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

const total = durations.reduce((a, b) => a + b, 0);
console.log(`\nDone. ${generated} generated, ${cached} cached.`);
console.log(`  Total duration : ${total.toFixed(2)}s`);
console.log(`  Clips          : ${outDir}/beat-NN.mp3`);
console.log(`  Durations      : ${outDir}/durations.json`);
console.log(`  Manifest       : ${manifestPath}`);
