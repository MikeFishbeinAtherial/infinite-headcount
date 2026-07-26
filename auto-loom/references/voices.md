# ElevenLabs voices

Set `ELEVENLABS_VOICE_ID` in `.env.local`, or override per storyboard:

```json
{ "voice": { "voiceId": "onwK4e9ZLuTAKqWW03F9" } }
```

## Free tier (premade voices — always work via API)

| Voice ID | Name | Character |
|---|---|---|
| `cgSgspJ2msm6clMCkdW9` | Jessica | Playful, bright, warm |
| `EXAVITQu4vr4xnSDxMaL` | Sarah | Mature, reassuring |
| `Xb7hH8MSUJpSbSDYk0k2` | Alice | Clear, engaging |
| `XrExE9yKIg1WjnnlVkGX` | Matilda | Professional |
| `onwK4e9ZLuTAKqWW03F9` | Daniel | Steady broadcaster (male) |
| `nPczCjzI2devNBz1zQrb` | Brian | Deep, resonant (male) |

## Paid tier

Library voices, professional voices, and **cloned voices** (your own voice —
the killer feature for sales videos) all require a paid ElevenLabs plan. A
`payment_required` error from `gen-audio.mjs` means the voice ID needs a paid
plan on your account tier.

`doctor.mjs` checks your key, tier, and voice compatibility up front:

```bash
node scripts/doctor.mjs
```

## Model — `eleven_v3` is the default (as of this engine version)

Set `ELEVENLABS_MODEL` in `.env.local`, or per storyboard, to override:

```json
{ "voice": { "model": "eleven_multilingual_v2" } }
```

| Model | When to use |
|---|---|
| **`eleven_v3` (default)** | Expressive, less "read aloud" — real emotional range and inline audio tags (below). Best for client-update, sales, and framing beats where warmth matters. |
| `eleven_multilingual_v2` | Flatter, very consistent, no tag support. Fall back to this if v3 mispronounces something v2 handled fine, or if a cloned voice sounds noticeably worse on v3 (see caveat below). |

**Cloned-voice caveat (matters for sales videos):** ElevenLabs' own docs state
Professional Voice Clones are "not fully optimized for Eleven v3." If your
cloned voice sounds off on v3 — flatter than expected, or tags not landing —
override back to `eleven_multilingual_v2` for that project rather than
fighting it. Premade/library voices don't have this issue.

### Audio tags — the actual v3 vocabulary

Drop these directly into `beat.text`, in brackets, where you want the sound:

- **Delivery:** `[laughs]`, `[laughs harder]`, `[wheezing]`, `[whispers]`,
  `[sighs]`, `[exhales]`, `[sarcastic]`, `[curious]`, `[excited]`, `[crying]`,
  `[mischievously]`
- **Sound effects:** `[applause]`, `[clapping]`, `[gunshot]`, `[explosion]`
- **Experimental** (less consistent across voices): `[strong French accent]`
  (any accent), `[sings]`

Use 1-2 tags per video, on framing beats only — see `tts-rules.md`. A tag on
every line reads as gimmicky, not human. **Voice/tag mismatch breaks it**: a
calm voice told `[shouting]` or a shouting delivery told `[whispers]`
generally won't render well — match the tag to what the voice can plausibly do.

### Formatting that actually affects delivery

- **Ellipses (`...`)** create a real pause — use them, not extra periods.
- **CAPITALIZING a word** increases emphasis on it.
- **No SSML `<break>` tags** — v3 doesn't support them; use tags/ellipses/
  punctuation instead.

## Voice settings — fine-tuning delivery

Still the same three numeric knobs (`stability`/`similarity_boost`/`style`,
default `{0.5, 0.8, 0.2}`), overridable per storyboard:

```json
{ "voice": { "settings": { "stability": 0.3 } } }
```

`stability` is what ElevenLabs' own dashboard now labels **Creative / Natural
/ Robust** — same underlying 0-1 field, three informal bands rather than a
documented hard cutoff:

| Band | Roughly | Effect |
|---|---|---|
| Creative | low (~0.0-0.3) | Most emotional and tag-responsive. ElevenLabs' own docs: **"prone to hallucinations."** Don't use for narration that states a fact or number — an ad-libbed word in a claim is worse than a flat delivery. |
| Natural (default, 0.5) | mid | Balanced — closest to the reference recording. Good default for most beats. |
| Robust | high (~0.7-1.0) | Very stable, less responsive to tags — closest to v2's behavior. Use for claims-bearing narration (see `auto-loom-proof`, which pins this band). |

`similarity_boost` and `style` still exist on the API but do less of the work
on v3 than tags and the stability band do — leave them at default unless a
cloned voice needs a nudge (raise `similarity_boost` toward 0.9 if it drifts
off-timbre).

**The naturalism trap:** none of these settings fix a script that reads like a
script. See `tts-rules.md` → "Writing narration that sounds human" — the
words matter more than the knobs.
