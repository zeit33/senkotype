import { renderSequence } from './sequence.js';
import { resetScore } from './score.js';
import { timingState } from './timingSettings.js';
import { recordSequence, recordWord, recordBreak, resetStats } from './stats.js';
import { gameInput, seqCountEl, wordSeqCountEl, bestStreakEl } from './ui.js';
import { setMood } from './character.js';
import { getMode } from './modes/modeManager.js';

export const state = {
    activeSequence:        "",
    timer:                 0,
    timerStarted:          false,
    finishing:             false,
    roundStartTime:        0,
    totalRoundDuration:    0,
    carryoverTime:         0,
    sequenceCount:         0,
    currentSequenceCount:  0,
    currentWordSequence:   0,
};

let bestStreak   = parseInt(localStorage.getItem("bestStreak") || "0");
let roundTimeout = null;
bestStreakEl.textContent = bestStreak;

export function beginTimer() {
    if (state.timerStarted) return;
    state.timerStarted   = true;
    state.roundStartTime = performance.now();
    if (!timingState.timedMode) return;
    state.totalRoundDuration = state.carryoverTime + state.timer * getMode().msPerLetter(state.currentSequenceCount);
    clearTimeout(roundTimeout);
    roundTimeout = setTimeout(finishRound, state.totalRoundDuration);
}

export function startRound() {
    clearTimeout(roundTimeout);
    state.activeSequence = getMode().nextSequence();

    if (typeof getMode().onRoundStart === 'function') {
        getMode().onRoundStart(state.activeSequence);
    } else {
        renderSequence(state.activeSequence, getMode().getRenderOptions());
    }

    gameInput.value          = "";
    state.timerStarted       = false;
    state.finishing          = false;
    state.roundStartTime     = 0;
    state.totalRoundDuration = 0;
    state.timer              = state.activeSequence.length;
    setMood("idle");
}

export function finishRound() {
    if (state.finishing) return;
    state.finishing    = true;
    state.timerStarted = false;
    clearTimeout(roundTimeout);

    if (state.roundStartTime > 0) {
        const elapsed = performance.now() - state.roundStartTime;
        state.carryoverTime = Math.max(0, state.totalRoundDuration - elapsed);
    } else {
        state.carryoverTime = 0;
    }

    const typed = gameInput.value;
    const success = typed.toLowerCase() === state.activeSequence.toLowerCase();

    if (success) {
        state.sequenceCount++;
        // Count the last word if sequence doesn't end with a space
        if (state.activeSequence.trim() && !state.activeSequence.endsWith(' ')) {
            state.currentWordSequence++;
            wordSeqCountEl.textContent = state.currentWordSequence;
        }
        recordSequence();
        recordWord(state.activeSequence);
        if (state.currentSequenceCount > bestStreak) {
            bestStreak = state.currentSequenceCount;
            localStorage.setItem("bestStreak", bestStreak);
            bestStreakEl.textContent = bestStreak;
        }
        setMood(state.currentSequenceCount >= 10 ? "happy" : "good");
    } else {
        if (state.currentSequenceCount > 0) recordBreak();
        state.currentSequenceCount = 0;
        state.currentWordSequence  = 0;
        state.carryoverTime        = 0;
        seqCountEl.textContent     = 0;
        wordSeqCountEl.textContent = 0;
        setMood("sad");
    }

    getMode().onRoundComplete(success);

    const gap = getMode().roundGapMs?.() ?? 700;
    setTimeout(() => {
        gameInput.style.border = "none";
        startRound();
    }, gap);
}

export function resetGame() {
    clearTimeout(roundTimeout);
    resetScore();
    resetStats();
    getMode().reset();
    state.sequenceCount        = 0;
    state.currentSequenceCount = 0;
    state.currentWordSequence  = 0;
    state.carryoverTime        = 0;
    seqCountEl.textContent     = 0;
    wordSeqCountEl.textContent = 0;
    startRound();
}
