import { LEFT, RIGHT } from '../fingerData.js';
import { timingState } from '../timingSettings.js';
import { slidingRoundStart, slidingCharTyped, slidingDeactivate } from '../slidingDisplay.js';

const MIN_LETTERS  = 3;
const RAND_LETTERS = 3;

const modeState = {
    handSetting:  'both',
    _currentSeq:  '',
};

export const sequenceMode = {
    id: 'sequence',
    name: 'Sequence',

    activate(container) {
        container.innerHTML = `
            <div class="mode-setting hand-group">
                <label class="mode-check"><input type="radio" name="hand" value="both"> Both Hands</label>
                <label class="mode-check"><input type="radio" name="hand" value="left"> Left Only</label>
                <label class="mode-check"><input type="radio" name="hand" value="right"> Right Only</label>
            </div>
        `;

        container.querySelectorAll('input[name="hand"]').forEach(radio => {
            radio.checked = radio.value === modeState.handSetting;
            radio.addEventListener('change', e => {
                modeState.handSetting = e.target.value;
            });
        });
    },

    deactivate() {
        slidingDeactivate();
    },

    nextSequence() {
        let pool;
        if (modeState.handSetting === 'left') {
            pool = LEFT;
        } else if (modeState.handSetting === 'right') {
            pool = RIGHT;
        } else {
            pool = LEFT + RIGHT;
        }
        const length = Math.floor(Math.random() * RAND_LETTERS) + MIN_LETTERS;
        let result = '';
        for (let i = 0; i < length; i++) {
            result += pool[Math.floor(Math.random() * pool.length)];
        }
        return result;
    },

    msPerLetter(sequenceCount) {
        return timingState.baseMsPerLetter / Math.max(1, sequenceCount);
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

    roundGapMs() {
        return 0;
    },

    onRoundComplete(_success) {},

    reset() {},
};
