import { state, beginTimer, finishRound, resetGame } from './game.js';
import { gameInput, rhythmDisplay, seqCountEl, wordSeqCountEl } from './ui.js';
import { calculateMood } from './character.js';
import { getMode } from './modes/modeManager.js';
import { addScore } from './score.js';
import { recordLetter, recordMistake, getMistakes } from './stats.js';

export function setupInput() {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { resetGame(); return; }
    });

    let _inMistake = false;

    gameInput.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" || e.key === "Delete") { e.preventDefault(); return; }
        if (e.key.length > 1) return;
        if (e.repeat) { e.preventDefault(); return; }

        if (!state.timerStarted) {
            beginTimer();
        }

        const nextTyped = gameInput.value + e.key;
        const expected  = state.activeSequence.slice(0, nextTyped.length);

        if (nextTyped !== expected) {
            e.preventDefault();

            if (!_inMistake) {
                _inMistake = true;
                recordMistake();
                state.currentSequenceCount = 0;
                state.currentWordSequence  = 0;
                seqCountEl.textContent     = 0;
                wordSeqCountEl.textContent = 0;
            }

            gameInput.style.color      = "#ff5c5c";
            gameInput.style.background = "rgba(255,80,80,0.18)";
            setMood("wondering");

            setTimeout(() => {
                gameInput.style.color      = "white";
                gameInput.style.background = "rgba(255,255,255,0.08)";
            }, 120);

            return;
        }

        _inMistake = false;
        state.currentSequenceCount++;
        seqCountEl.textContent = state.currentSequenceCount;
        if (e.key === ' ') {
            state.currentWordSequence++;
            wordSeqCountEl.textContent = state.currentWordSequence;
        }

        calculateMood(state.currentSequenceCount);

        addScore(10 + state.currentSequenceCount + state.currentWordSequence + 1 - getMistakes());
        recordLetter();
        rhythmDisplay.style.background = "#5cff72";
        setTimeout(() => {
            rhythmDisplay.style.background = "rgba(255,255,255,0.08)";
        }, 80);

        setTimeout(() => {
            getMode().onCharTyped?.(gameInput.value.length);
            if (gameInput.value === state.activeSequence) {
                finishRound();
            }
        }, 0);
    });    
}

