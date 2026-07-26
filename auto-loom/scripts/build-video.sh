#!/usr/bin/env bash
# build-video.sh — concatenate audio clips + mux with silent video → final MP4
#
# Usage:
#   bash scripts/build-video.sh <audio_dir> <video.webm> <output.mp4> [captions.srt]
#
# <video.webm> must be an exact file path (render.mjs writes recording.webm).
# If captions.srt is given it is muxed as a soft mov_text track; set BURN=1 to
# burn the captions into the pixels instead (for platforms that strip tracks).
#
# Outputs:
#   <output.mp4>               — H.264 / AAC faststart
#   <output>-contact-sheet.png — sampled frames for eyeball verification

set -euo pipefail

AUDIO_DIR="${1:?Usage: build-video.sh <audio_dir> <video.webm> <output.mp4> [captions.srt]}"
INPUT_VIDEO="${2:?missing video.webm path}"
OUTPUT_MP4="${3:?missing output.mp4 path}"
CAPTIONS="${4:-}"

if [ ! -f "$INPUT_VIDEO" ]; then
  echo "ERROR: video file not found: $INPUT_VIDEO"
  echo "render.mjs writes <out>/recording.webm — pass that exact path."
  exit 1
fi

# Absolutize paths up front. The burn branch cds into the captions directory
# (a path interpolated into an ffmpeg filtergraph gets parsed for filter
# syntax — ':' ',' quotes — so we reference the srt by bare filename instead),
# and absolute paths keep every other argument valid after the cd.
abspath() { case "$1" in /*) printf '%s\n' "$1" ;; *) printf '%s/%s\n' "$PWD" "$1" ;; esac; }
AUDIO_DIR="$(abspath "$AUDIO_DIR")"
INPUT_VIDEO="$(abspath "$INPUT_VIDEO")"
OUTPUT_MP4="$(abspath "$OUTPUT_MP4")"
if [ -n "$CAPTIONS" ]; then
  CAPTIONS="$(abspath "$CAPTIONS")"
fi

echo "=== auto-loom build ==="
echo "  audio dir  : $AUDIO_DIR"
echo "  video      : $INPUT_VIDEO"
echo "  captions   : ${CAPTIONS:-none}"
echo "  output     : $OUTPUT_MP4"
echo ""

# ── 1. Concatenate audio clips in beat order ──────────────────────────────────
CONCAT_LIST=$(mktemp "${TMPDIR:-/tmp}/al-concat.XXXXXX.txt")
shopt -s nullglob
for f in "$AUDIO_DIR"/beat-*.mp3; do
  echo "file '$(realpath "$f")'" >> "$CONCAT_LIST"
done
shopt -u nullglob

if [ ! -s "$CONCAT_LIST" ]; then
  echo "ERROR: no beat-NN.mp3 files found in $AUDIO_DIR — run gen-audio.mjs first."
  rm -f "$CONCAT_LIST"
  exit 1
fi

MERGED_AUDIO=$(mktemp "${TMPDIR:-/tmp}/al-merged.XXXXXX.mp3")
echo "Concatenating audio clips..."
ffmpeg -y -f concat -safe 0 -i "$CONCAT_LIST" \
  -c:a libmp3lame -q:a 2 \
  "$MERGED_AUDIO" 2>/dev/null

# ── 2. Mux audio + video (+ optional captions) ────────────────────────────────
# Playwright's recorded webm often runs shorter than wall time, and -shortest
# would clip the end of the narration. Clone-pad the video's last frame so the
# audio track always determines the final length.
PAD="tpad=stop_mode=clone:stop_duration=30"

echo "Muxing audio + video..."
if [ -n "$CAPTIONS" ] && [ "${BURN:-0}" = "1" ]; then
  # Burned-in captions: re-encode with subtitles filter. Run ffmpeg from the
  # captions directory and reference the srt by bare filename — interpolating
  # the full path into the filtergraph would let ffmpeg parse it as filter
  # syntax (breaks on ':' ',' quotes in the path).
  (
    cd "$(dirname "$CAPTIONS")"
    ffmpeg -y \
      -i "$INPUT_VIDEO" \
      -i "$MERGED_AUDIO" \
      -vf "$PAD,subtitles=$(basename "$CAPTIONS")" \
      -c:v libx264 -preset fast -crf 22 \
      -c:a aac -b:a 192k \
      -movflags +faststart \
      -shortest \
      "$OUTPUT_MP4" 2>&1 | tail -5
  )
elif [ -n "$CAPTIONS" ]; then
  # Soft subtitle track (viewer can toggle)
  ffmpeg -y \
    -i "$INPUT_VIDEO" \
    -i "$MERGED_AUDIO" \
    -i "$CAPTIONS" \
    -map 0:v -map 1:a -map 2:s \
    -vf "$PAD" \
    -c:v libx264 -preset fast -crf 22 \
    -c:a aac -b:a 192k \
    -c:s mov_text \
    -movflags +faststart \
    -shortest \
    "$OUTPUT_MP4" 2>&1 | tail -5
else
  ffmpeg -y \
    -i "$INPUT_VIDEO" \
    -i "$MERGED_AUDIO" \
    -vf "$PAD" \
    -c:v libx264 -preset fast -crf 22 \
    -c:a aac -b:a 192k \
    -movflags +faststart \
    -shortest \
    "$OUTPUT_MP4" 2>&1 | tail -5
fi

# ── 3. Verify ─────────────────────────────────────────────────────────────────
echo ""
echo "=== Verification ==="

VIDEO_DUR=$(ffprobe -v quiet -print_format json -show_format "$OUTPUT_MP4" \
  | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(JSON.parse(d).format.duration*1+'s'))")
echo "  Duration      : $VIDEO_DUR"

LOUDNESS=$(ffmpeg -i "$OUTPUT_MP4" -af "volumedetect" -f null /dev/null 2>&1 \
  | grep mean_volume | awk '{print $5, $6}')
echo "  Mean volume   : $LOUDNESS"

if [[ "$LOUDNESS" == *"-91"* ]] || [[ -z "$LOUDNESS" ]]; then
  echo "  WARNING: audio may be silent. Check that the audio stream muxed correctly."
fi

# ── 4. Contact sheet ──────────────────────────────────────────────────────────
SHEET="${OUTPUT_MP4%.mp4}-contact-sheet.png"
ffmpeg -y -i "$OUTPUT_MP4" \
  -vf "fps=1/5,scale=320:-1,tile=5x2" \
  -frames:v 1 "$SHEET" 2>/dev/null \
  && echo "  Contact sheet : $SHEET (eyeball each frame vs its beat)"

# ── 5. Cleanup ────────────────────────────────────────────────────────────────
rm -f "$CONCAT_LIST" "$MERGED_AUDIO"

echo ""
echo "OUTPUT: $OUTPUT_MP4"
