import { timingState } from '../timingSettings.js';
import { slidingRoundStart, slidingCharTyped, slidingDeactivate } from '../slidingDisplay.js';

const modeState = {
    text:             '',
    fileName:         '',
    position:         0,
    chunkSize:        10,
    _currentChunkLen: 0,
};

function normalizeText(raw) {
    return raw
        .toLowerCase()
        .replace(/\r?\n|\t/g, ' ')
        .replace(/[^ a-z]/g, '')
        .replace(/ {2,}/g, ' ')
        .trim();
}

export const textMode = {
    id: 'text',
    name: 'Text',

    activate(container) {
        container.innerHTML = `
            <div class="mode-setting">
                <button id="text-load-btn" class="ctrl-btn">Load file…</button>
                <input type="file" id="text-file-input" accept=".txt" style="display:none">
                <div id="text-filename" class="text-filename">${modeState.fileName || 'no file loaded'}</div>
            </div>
            <div class="mode-setting">
                <label class="ctrl-label">Start at
                    <input type="number" id="text-start" class="ctrl-input"
                        min="0" value="${modeState.position}" step="1">
                </label>
            </div>
            <div class="mode-setting">
                <label class="ctrl-label">Chunk size
                    <input type="number" id="text-chunk" class="ctrl-input"
                        min="1" max="30" value="${modeState.chunkSize}" step="1">
                </label>
            </div>
        `;

        document.getElementById('text-load-btn').addEventListener('click', () => {
            document.getElementById('text-file-input').click();
        });

        document.getElementById('text-file-input').addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                modeState.text     = normalizeText(ev.target.result);
                modeState.fileName = file.name;
                modeState.position = 0;
                const fnEl = document.getElementById('text-filename');
                if (fnEl) fnEl.textContent = file.name;
                const startEl = document.getElementById('text-start');
                if (startEl) startEl.value = 0;
            };
            reader.readAsText(file);
        });

        document.getElementById('text-start').addEventListener('change', e => {
            const val = parseInt(e.target.value) || 0;
            modeState.position = Math.max(0, Math.min(val, modeState.text.length));
        });

        document.getElementById('text-chunk').addEventListener('change', e => {
            modeState.chunkSize = Math.max(1, Math.min(30, parseInt(e.target.value) || 10));
        });
    },

    deactivate() {
        slidingDeactivate();
    },

    nextSequence() {
        if (!modeState.text) return 'load a file';
        if (modeState.position >= modeState.text.length) {
            modeState.position = 0;
        }
        const chunk = modeState.text
            .slice(modeState.position, modeState.position + modeState.chunkSize) || 'end';
        modeState._currentChunkLen = chunk.length;
        return chunk;
    },

    msPerLetter(sequenceCount) {
        return timingState.baseMsPerLetter / Math.max(1, sequenceCount);
    },

    getRenderOptions() {
        return { fingerColors: false };
    },

    onRoundStart(_sequence) {
        slidingRoundStart(modeState.text || _sequence, modeState.text ? modeState.position : 0);
    },

    onCharTyped(typedCount) {
        if (!modeState.text) return;
        slidingCharTyped(typedCount, modeState.text, modeState.position, modeState._currentChunkLen);
    },

    roundGapMs() {
        return 0;
    },

    onRoundComplete(success) {
        if (success && modeState.text) {
            modeState.position = Math.min(
                modeState.position + modeState.chunkSize,
                modeState.text.length
            );
            const startEl = document.getElementById('text-start');
            if (startEl) startEl.value = modeState.position;
        }
    },

    reset() {},
};
