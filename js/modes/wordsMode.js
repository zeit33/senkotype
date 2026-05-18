import { timingState, presets } from '../timingSettings.js';
import { launchFireworks, stopFireworks } from '../fireworks.js';
import { slidingRoundStart, slidingCharTyped, slidingDeactivate } from '../slidingDisplay.js';

const modeState = {
    allWords:       [],
    wordCount:      100,
    _completionGap: false,
    _currentSeq:    '',
};

async function loadWords() {
    if (modeState.allWords.length > 0) return;
    const resp = await fetch('./Dictionary/popular%20words.txt');
    const text = await resp.text();
    modeState.allWords = text.split('\n').map(w => w.trim()).filter(Boolean);
}

function buildRound() {
    const pool = modeState.allWords;
    return Array.from({ length: modeState.wordCount },
        () => pool[Math.floor(Math.random() * pool.length)]).join(' ');
}

function setWordCount(n, container) {
    modeState.wordCount = n;
    const input = container.querySelector('#words-count-input');
    if (input) input.value = n;
    container.querySelectorAll('.count-btn').forEach(b =>
        b.classList.toggle('active', Number(b.dataset.count) === n));
}

export const wordsMode = {
    id: 'words',
    name: 'Words',

    activate(container) {
        const currentPreset = timingState.preset || 'normal';
        container.innerHTML = `
            <div class="mode-setting">
                <div class="section-label" style="margin-bottom:4px">Word Count</div>
                <div class="preset-buttons">
                    <button class="preset-btn count-btn${modeState.wordCount === 10    ? ' active' : ''}" data-count="10">10</button>
                    <button class="preset-btn count-btn${modeState.wordCount === 100   ? ' active' : ''}" data-count="100">100</button>
                    <button class="preset-btn count-btn${modeState.wordCount === 1000  ? ' active' : ''}" data-count="1000">1K</button>
                    <button class="preset-btn count-btn${modeState.wordCount === 10000 ? ' active' : ''}" data-count="10000">10K</button>
                </div>
                <label class="ctrl-label" style="margin-top:4px">Count
                    <input type="number" id="words-count-input" class="ctrl-input"
                        min="1" max="10000" value="${modeState.wordCount}" step="1">
                </label>
            </div>
        `;

        container.querySelectorAll('.words-diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.preset;
                timingState.baseMsPerLetter = presets[id].ms;
                timingState.preset = id;
                container.querySelectorAll('.words-diff-btn').forEach(b =>
                    b.classList.toggle('active', b.dataset.preset === id));
                document.querySelectorAll('.preset-btn[data-preset]').forEach(b =>
                    b.classList.toggle('active', b.dataset.preset === id));
                const msInput = document.getElementById('ms-per-letter-input');
                if (msInput) msInput.value = presets[id].ms;
            });
        });

        container.querySelectorAll('.count-btn').forEach(btn => {
            btn.addEventListener('click', () => setWordCount(Number(btn.dataset.count), container));
        });

        container.querySelector('#words-count-input').addEventListener('change', e => {
            const val = Math.max(1, Math.min(10000, parseInt(e.target.value) || 100));
            modeState.wordCount = val;
            e.target.value = val;
            container.querySelectorAll('.count-btn').forEach(b =>
                b.classList.toggle('active', Number(b.dataset.count) === val));
        });

        loadWords();
    },

    deactivate() {
        slidingDeactivate();
    },

    nextSequence() {
        modeState._completionGap = false;
        if (modeState.allWords.length === 0) return 'loading…';
        return buildRound();
    },

    msPerLetter(seqCount) {
        return timingState.baseMsPerLetter / Math.max(1, seqCount);
    },

    getRenderOptions() {
        return { fingerColors: timingState.fingerColors };
    },

    onRoundStart(sequence) {
        modeState._currentSeq = sequence;
        slidingRoundStart(sequence, 0);
    },

    onCharTyped(typedCount) {
        slidingCharTyped(typedCount, modeState._currentSeq, 0, modeState._currentSeq.length);
    },

    onRoundComplete(success) {
        if (!success) return;
        modeState._completionGap = true;
        launchFireworks(5000);
    },

    roundGapMs() {
        return modeState._completionGap ? 5200 : 700;
    },

    reset() {
        stopFireworks();
        modeState._completionGap = false;
        modeState._currentSeq    = '';
    },
};
