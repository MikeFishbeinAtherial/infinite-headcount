#!/usr/bin/env node
// make-captions.mjs — build an .srt subtitle track from the audio manifest.
// The manifest already holds each beat's exact narration text and measured
// duration, so caption timing is derived, not guessed. Beats longer than
// ~7s are split at sentence boundaries, time allocated by word count.
//
// Usage:
//   node scripts/make-captions.mjs --audio <outdir>/audio --out <outdir>/captions.srt

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { parseArgs } from './lib.mjs';

const MAX_CUE_SECONDS = 7;

const argv = parseArgs(process.argv.slice(2));
const audioDir = argv['--audio'];
const outPath  = argv['--out'];
const offsetSec = typeof argv['--offset'] === 'string' ? parseFloat(argv['--offset']) : 0;
if (!audioDir || !outPath) {
  console.error('Usage: node scripts/make-captions.mjs --audio <audio_dir> --out <captions.srt>');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(join(audioDir, 'manifest.json'), 'utf8'));

const cues = [];
let clock = 0;

for (const beat of manifest) {
  const text = String(beat.text).trim();
  const sentences = text.match(/[^.!?]+[.!?]*/g)?.map(s => s.trim()).filter(Boolean) ?? [text];

  // Group sentences into cues that each fit MAX_CUE_SECONDS
  const totalWords = text.split(/\s+/).length;
  const secPerWord = beat.duration / totalWords;
  const groups = [];
  let current = [];
  let currentWords = 0;
  for (const sentence of sentences) {
    const w = sentence.split(/\s+/).length;
    if (current.length && (currentWords + w) * secPerWord > MAX_CUE_SECONDS) {
      groups.push({ text: current.join(' '), words: currentWords });
      current = []; currentWords = 0;
    }
    current.push(sentence); currentWords += w;
  }
  if (current.length) groups.push({ text: current.join(' '), words: currentWords });

  for (const group of groups) {
    const dur = (group.words / totalWords) * beat.duration;
    cues.push({ start: clock + offsetSec, end: clock + dur + offsetSec, text: group.text });
    clock += dur;
  }
}

const srt = cues
  .map((cue, i) => `${i + 1}\n${ts(cue.start)} --> ${ts(cue.end)}\n${cue.text}\n`)
  .join('\n');
writeFileSync(outPath, srt);
console.log(`Captions: ${cues.length} cues, ${clock.toFixed(2)}s → ${outPath}`);

function ts(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(Math.floor(seconds % 60)).padStart(2, '0');
  const ms = String(Math.round((seconds % 1) * 1000)).padStart(3, '0');
  return `${h}:${m}:${s},${ms}`;
}
