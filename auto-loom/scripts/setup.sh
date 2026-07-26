#!/usr/bin/env bash
# setup.sh — one-time install for the auto-loom skill.
# Installs Playwright + Chromium, then runs doctor.mjs to verify everything.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"

cd "$ROOT"

echo "Installing Playwright (pinned in package.json)..."
npm install

echo "Installing Chromium browser (~300MB, one-time)..."
npx playwright install chromium

if [ ! -f "$ROOT/.env.local" ] && [ -f "$ROOT/.env.example" ]; then
  echo ""
  echo "No .env.local found — creating one from .env.example."
  echo "Edit it and add your ElevenLabs API key (free at elevenlabs.io)."
  cp "$ROOT/.env.example" "$ROOT/.env.local"
fi

echo ""
echo "Running environment check..."
node "$SCRIPT_DIR/doctor.mjs" || true

echo ""
echo "Setup finished. If doctor reported failures, fix them before your first video."
