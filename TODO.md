# senkotype — TODO

## Bugs

- [x] **Double `finishRound` call** (`game.js`)
  Added `state.finishing` guard. `finishRound` returns early if already finishing; cleared in `startRound`.

- [x] **`beginTimer` starts on ignored keys** (`input.js`)
  Moved `beginTimer` call to after the Backspace / multi-char filter.

- [x] **Irregular beat on round transition** (`audio.js`, `main.js`)
  Removed immediate `beatPulse()` from `startMetronome`. `main.js` now calls `beatPulse()` once explicitly at game start before starting the interval.

- [x] **Dead code: `correct` counter** (`game.js`)
  Removed the unused `correct` variable and its loop from `finishRound`.

- [x] **Timer shows 0.000 during inter-round gap** (`game.js`)
  `finishRound` now resets `state.timer = state.activeSequence.length` before zeroing `timerStarted`, so the display shows a positive number during the 700ms gap.

- [x] **`BEAT_INPUT_WINDOW` does not scale with tempo** (`audio.js`, `input.js`)
  Replaced fixed constant with `getBeatWindow() = max(50, beatLength * 0.3)`. PERFECT/GOOD thresholds scale proportionally (20% / 40% of the window).

## Missing Features

- [x] **Visual timing feedback** (`input.js`, `ui.js`, `senkotype.css`)
  `timingLabel` element added to `messageBox`. Shows PERFECT / GOOD / OK / EARLY PERFECT etc. with colour coding and a fade-out animation. Also shown for BAD (off-beat) hits. Rhythm circle background changes colour per grade.

- [x] **High score and best streak** (`score.js`, `game.js`, `senkotype.html`)
  `highScore` persisted in `localStorage`, updated in `score.js` on every `addScore`. `bestStreak` persisted in `localStorage`, updated in `finishRound`. Both displayed in left column.

- [x] **Reset via Escape key** (`input.js`, `game.js`, `score.js`)
  `document` keydown listener for Escape calls `resetGame()` which resets score, sequenceCount, and rhythm stats, then calls `startRound()`. `resetScore()` exported from `score.js`.

- [x] **Rhythm accuracy stat** (`game.js`, `input.js`, `senkotype.html`)
  `state.rhythmHits` / `state.rhythmAttempts` tracked per session. `rhythmAccuracyEl` updated in `finishRound`. Both on-beat and off-beat keypresses are counted.

## Code Quality

- [x] **HTML title** (`senkotype.html`)
  Changed from `"Idle Game UI"` to `"senkotype"`.

- [x] **Inline styles → CSS classes** (`ui.js`, `senkotype.css`)
  `sequenceDisplay` uses `.sequence-display`, `rhythmDisplay` uses `.rhythm-display`. Styles live in `senkotype.css`.

- [x] **LEFT / RIGHT string duplication** — confirmed resolved in the refactor. `sequence.js` uses imported constants from `fingerData.js`.
