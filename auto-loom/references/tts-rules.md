# Narration script rules (TTS)

`validate.mjs` lints for most of these before any ElevenLabs spend.

- **One idea per beat.** A beat is one narration line + one visual moment.
- **Short sentences.** 10–20 words. Break long sentences at natural pauses.
- **No em dashes, few commas.** ElevenLabs pauses oddly on em dashes; use periods.
- **Use `...` for a real pause, CAPS for emphasis on a word.** These affect
  delivery on v3; SSML `<break>` tags are not supported — don't use them.
- **Spell initialisms with hyphens:** `A-I`, `A-P-I`, `U-R-Ls`, `S-O-V`, `G-T-M`.
  Bare `AI`, `API`, `URLs` get mispronounced.
- **Direct address.** "Your visibility score is 76" beats "the brand's score is 76."
- **Frame the problem before the feature.** Beat 1 = why this matters to *them*.
- **End with a CTA or handoff.** The final beat delivers the approved call to action verbatim.
- **Pace at ~140 words/minute.** 5 beats × ~14s ≈ 70s. Set `meta.targetLengthSec`
  and the validator warns when the word count implies < 110 or > 170 wpm.

## Beat framing that works (client update / demo format)

| Beat | Purpose | Example |
|---|---|---|
| 1 | Greeting + their problem or what changed | "Hey Jim. We shipped updates to your A-I visibility tracker." |
| 2 | The big picture view | "You lead on ChatGPT and Gemini. Vapi is ahead on Perplexity. That gap is now visible." |
| 3 | Specific win / proof point | "This query was not citing you last month. Now it is. Three citations." |
| 4 | Deeper capability | "This is the citations view. We show exactly which U-R-Ls the A-I engines pull." |
| 5 | Trend + CTA | "Visibility up six points in two weeks. Grab twenty minutes on my calendar." |

## Writing narration that sounds human

A flawless script is the #1 tell that a voiceover was AI-generated. Once
pronunciation is clean (the rules above), work against over-polish:

- **Contractions.** "It's" and "you're," not "it is" and "you are."
- **Vary sentence length on purpose.** A short one after a longer one reads
  as a person thinking, not a teleprompter.
- **The occasional aside or restart** — "actually, here's the better way to
  see it" — signals a person talking, not a script being read.
- **Direct address stays** (see the rule above) — human and precise aren't
  in tension.
- **Audio tags** (`[exhales]`, `[laughs]`, `[sighs]`, full list in
  `voices.md` → Model) add texture the words alone can't. 1-2 per video, on
  framing beats — a tag on every line reads as gimmicky, not human. Match
  the tag to what the voice can plausibly do (don't tag a calm voice
  `[shouting]`).

**Where this doesn't apply: claims-bearing narration.** In a video that's
*proving* something (auto-loom-proof, or any beat asserting a specific
number or result), prioritize clarity and confidence over casual texture —
every sentence there is a claim about what the viewer is watching, and an
aside or restart around a load-bearing fact reads as uncertainty, not
warmth. Save the human touches for framing beats (the opener, the closer,
the "why this matters" line) and keep the beats that state a fact or result
plain and direct.

## Iterating cheaply

Audio clips are cached by text hash. Editing one beat's narration and
re-running regenerates only that clip — the other beats cost nothing.
