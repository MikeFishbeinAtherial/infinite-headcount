# Getting the recording browser logged in

`render.mjs` launches a fresh Chromium — your own Chrome login does not carry
over. Login is established in a **throwaway, non-recorded context** first, so
the video never contains a login page and sync starts clean at frame 0.

Pick one path:

## A. Public or demo URL — nothing to do

## B. Scripted login (`auth` block, v2)

For any form you can describe as fill/click steps. Credentials come from the
environment via `env:` indirection — never inline them in the beats file.

```json
{
  "auth": {
    "loginUrl": "/signin",
    "steps": [
      { "fill": "input[name=username]", "value": "env:DEMO_EMAIL" },
      { "fill": "input[type=password]", "value": "env:DEMO_PASSWORD" },
      { "click": "button[type=submit]" }
    ],
    "success": { "urlGlob": "**/app/**" }
  }
}
```

- `success` is either `{"urlGlob": "**/dashboard**"}` or `{"sel": "[data-user-menu]"}` —
  a condition that only holds when authenticated.
- Optional `loginDetect` overrides the default login-page URL heuristic
  (`sign-in|login|auth`) used to detect session bounces.
- The legacy shape `{"loginUrl", "email", "password"}` still works: it maps to
  `#email` / `#password` / submit / wait for `**/dashboard**`.

## C. Saved session (`storageState`) — SSO, Google, magic link, 2FA

Capture a logged-in session once; the human logs in, the file stores cookies +
localStorage:

```bash
npx playwright codegen --save-storage=<slug>-session.json <start-url>
```

A browser opens — log in there, then close the window. Reference it from the
storyboard (path relative to the beats file):

```json
{ "storageState": "<slug>-session.json" }
```

Before recording a single frame, `render.mjs` opens the start URL in a
non-recorded context and verifies the session still works. If it expired you
get the exact re-capture command instead of a ruined take. If a session dies
*mid-recording*, the run aborts with the same instructions.

Expiry is detected by the landed URL matching the login heuristic
(`sign-in|login|auth`). If the app's login page has an unusual URL (e.g.
`/enter`, `/welcome`), tell the engine with a top-level key in the beats file:

```json
{ "storageState": "<slug>-session.json", "loginDetect": "/enter" }
```

## Session files are credentials

- Keep them out of git (`**/*-auth.json`, `**/storage-state*.json`, `*-session.json` patterns).
- Delete them when an engagement no longer needs re-recording.
- Never ask anyone to paste passwords into chat — logins happen in a browser
  window (path C) or via `.env.local` (path B).
