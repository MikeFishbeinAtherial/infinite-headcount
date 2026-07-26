// lib.mjs — shared helpers for the auto-loom pipeline scripts
// Zero dependencies. Node 18+.

import { readFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { resolve as absPath, dirname, basename, join } from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';

export const execAsync = promisify(execFile);

export const SKILL_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

// Default heuristic for "we got bounced to a login page"
export const LOGIN_URL_RE = /sign-?in|sign-?up|log-?in|logout|\/auth\b/i;

// ─── CLI args ─────────────────────────────────────────────────────────────────

export function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      out[argv[i]] = true;            // boolean flag
    } else {
      out[argv[i]] = next; i++;
    }
  }
  return out;
}

// ─── Env loading (tiny .env parser — no dotenv dependency) ────────────────────

export function loadEnvFile(path) {
  if (!existsSync(path)) return false;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2].replace(/\s+#.*$/, '').trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = val;
  }
  return true;
}

// Search order: explicit --env file, then .env.local beside the beats file,
// then .env.local / .env in the skill root. First hit wins per variable
// (already-set process.env always takes precedence).
export function loadEnv({ envFlag, beatsPath } = {}) {
  const loaded = [];
  const candidates = [
    envFlag,
    beatsPath && join(dirname(absPath(beatsPath)), '.env.local'),
    join(SKILL_ROOT, '.env.local'),
    join(SKILL_ROOT, '.env'),
  ].filter(Boolean);
  for (const c of candidates) if (loadEnvFile(c)) loaded.push(c);
  return loaded;
}

// Resolve "env:VAR_NAME" indirection used in auth steps
export function resolveEnvValue(value, context = 'auth step') {
  if (typeof value !== 'string' || !value.startsWith('env:')) return value;
  const name = value.slice(4);
  const resolved = process.env[name];
  if (resolved === undefined) {
    throw new Error(`${context} references "env:${name}" but ${name} is not set. Add it to .env.local or export it.`);
  }
  return resolved;
}

// ─── Beats loading / normalization ────────────────────────────────────────────

// Accepts v1 (bare array, or {beats} without meta) and v2. Returns a
// normalized object; never throws on shape — validate.mjs owns error quality.
export function loadBeats(beatsPath) {
  const raw = JSON.parse(readFileSync(beatsPath, 'utf8'));
  const isArray = Array.isArray(raw);
  return {
    raw,
    meta: (!isArray && raw.meta) || {},
    baseUrl: (!isArray && raw.baseUrl) || 'http://localhost:3000',
    viewport: (!isArray && raw.viewport) || { width: 1440, height: 900 },
    auth: (!isArray && raw.auth) || null,
    storageState: !isArray && raw.storageState
      ? absPath(dirname(absPath(beatsPath)), raw.storageState)
      : undefined,
    voice: (!isArray && raw.voice) || {},
    loginDetect: (!isArray && raw.loginDetect) || null,
    beats: isArray ? raw : (raw.beats ?? []),
  };
}

export function slugFor(beatsPath, normalized) {
  if (normalized?.meta?.slug) return normalized.meta.slug;
  return basename(beatsPath)
    .replace(/\.json$/i, '')
    .replace(/-beats$/i, '')
    .replace(/[^a-z0-9-]+/gi, '-')
    .toLowerCase();
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export function sha256(str) {
  return createHash('sha256').update(str).digest('hex');
}

export async function ffprobeDurationSeconds(filePath) {
  try {
    const { stdout } = await execAsync('ffprobe', [
      '-v', 'quiet', '-print_format', 'json', '-show_format', filePath,
    ]);
    return parseFloat(JSON.parse(stdout).format.duration);
  } catch {
    return null;
  }
}

export function globToRegExp(glob) {
  // Minimal ** / * glob → RegExp, enough for URL matching
  const esc = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '§§')
    .replace(/\*/g, '[^/]*')
    .replace(/§§/g, '.*');
  return new RegExp(esc);
}
