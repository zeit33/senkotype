import { startRound, resetGame, state } from './game.js';
import { initStats } from './stats.js';
import { setupInput } from './input.js';
import { timerDisplay, gameInput } from './ui.js';
import { registerMode, setMode, getMode } from './modes/modeManager.js';
import { sequenceMode } from './modes/sequenceMode.js';
import { textMode } from './modes/textMode.js';
import { wordsMode } from './modes/wordsMode.js';
import { timingState, presets } from './timingSettings.js';

/* register modes */
registerMode(wordsMode);
registerMode(sequenceMode);
registerMode(textMode);

/* mode buttons */
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setMode(btn.dataset.mode);
        resetGame();
    });
});

/* timing presets */
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.preset;
        timingState.baseMsPerLetter = presets[id].ms;
        timingState.preset = id;
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.toggle('active', b.dataset.preset === id));
        const input = document.getElementById('ms-per-letter-input');
        if (input) input.value = presets[id].ms;
    });
});

/* manual ms/letter input */
const msInput = document.getElementById('ms-per-letter-input');
if (msInput) {
    msInput.addEventListener('input', e => {
        const val = Math.max(50, Math.min(5000, parseInt(e.target.value) || 1000));
        timingState.baseMsPerLetter = val;
        timingState.preset = 'custom';
        document.querySelectorAll('.preset-btn').forEach(b => {
            b.classList.toggle('active', presets[b.dataset.preset]?.ms === val);
        });
    });
}

/* global finger colors toggle */
const fingerColorsCheckbox = document.getElementById('finger-colors-global');
fingerColorsCheckbox.addEventListener('change', e => {
    timingState.fingerColors = e.target.checked;
});

/* time pressure toggle */
const timedToggle = document.getElementById('timed-mode-toggle');
timedToggle.addEventListener('change', e => {
    timingState.timedMode = e.target.checked;
});

/* activate initial mode (after buttons exist in DOM) */
setMode('words');
initStats();

function animateTimer() {
    if (!timingState.timedMode) {
        timerDisplay.textContent = '∞';
        timerDisplay.style.color = '#a7f3ff';
    } else {
        let remaining;
        if (state.timerStarted) {
            remaining = Math.max(0, state.totalRoundDuration - (performance.now() - state.roundStartTime));
        } else {
            remaining = state.carryoverTime + state.timer * getMode().msPerLetter(state.sequenceCount);
        }
        timerDisplay.textContent = (remaining / 1000).toFixed(3);
        timerDisplay.style.color = remaining < 3000 ? "#ff7272" : "#a7f3ff";
    }
    requestAnimationFrame(animateTimer);
}

setupInput();
startRound();
animateTimer();

gameInput.focus();
document.addEventListener('click', e => {
    if (e.target.type !== 'number' && e.target.type !== 'file') {
        gameInput.focus();
    }
});
