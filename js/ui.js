import { fingerMap, fingerColors } from './fingerData.js';

export const scoreElement = document.getElementById("score");
export const timerDisplay = document.getElementById("timer");
export const messageBox   = document.getElementById("messageBox");
export const legendBox    = document.getElementById("legendBox");
export const gameInput    = document.getElementById("gameInput");
export const seqCountEl      = document.getElementById("seqCount");
export const wordSeqCountEl  = document.getElementById("wordSeqCount");
export const bestStreakEl = document.getElementById("bestStreak");
export const highScoreEl  = document.getElementById("highScore");

/* sequence display */
export const sequenceDisplay = document.createElement("div");
sequenceDisplay.className = "sequence-display";

/* rhythm pulse circle */
export const rhythmDisplay = document.createElement("div");
rhythmDisplay.className = "rhythm-display";

messageBox.innerHTML = "";
messageBox.appendChild(sequenceDisplay);
messageBox.appendChild(rhythmDisplay);

/* Keyboard + hand legend */
const KB_ROWS = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M'],
];

function buildKeyboard() {
    const kb = document.createElement('div');
    kb.className = 'kb-container';

    KB_ROWS.forEach((row, ri) => {
        const rowEl = document.createElement('div');
        rowEl.className = 'kb-row';
        rowEl.style.paddingLeft = (ri * 13) + 'px';
        row.forEach(key => {
            const k = document.createElement('div');
            k.className = 'kb-key';
            k.textContent = key;
            k.dataset.key = key.toLowerCase();
            const finger = fingerMap[key.toLowerCase()];
            if (finger) k.style.background = fingerColors[finger];
            rowEl.appendChild(k);
        });
        kb.appendChild(rowEl);
    });

    const spaceRow = document.createElement('div');
    spaceRow.className = 'kb-row';
    spaceRow.style.paddingLeft = '83px';
    const space = document.createElement('div');
    space.className = 'kb-key kb-space';
    space.dataset.key = 'space';
    spaceRow.appendChild(space);
    kb.appendChild(spaceRow);

    return kb;
}

function buildHand(side) {
    const isLeft = side === 'left';
    const c = fingerColors;
    const palm  = '#1a1d24';
    const thumb = 'rgba(255,255,255,0.18)';

    let svg;
    if (isLeft) {
        svg = `<svg class="hand-svg" viewBox="0 0 92 108" xmlns="http://www.w3.org/2000/svg">
            <rect x="5"  y="65" width="68" height="37" rx="10" fill="${palm}"/>
            <rect x="5"  y="35" width="15" height="34" rx="7"  fill="${c['left-pinky']}"  data-finger="left-pinky"/>
            <rect x="23" y="22" width="15" height="47" rx="7"  fill="${c['left-ring']}"   data-finger="left-ring"/>
            <rect x="41" y="15" width="15" height="54" rx="7"  fill="${c['left-middle']}" data-finger="left-middle"/>
            <rect x="59" y="23" width="15" height="46" rx="7"  fill="${c['left-index']}"  data-finger="left-index"/>
            <rect x="71" y="72" width="22" height="12" rx="6"  fill="${thumb}" transform="rotate(-35 71 78)"/>
        </svg>`;
    } else {
        svg = `<svg class="hand-svg" viewBox="0 0 92 108" xmlns="http://www.w3.org/2000/svg">
            <rect x="19" y="65" width="68" height="37" rx="10" fill="${palm}"/>
            <rect x="18" y="23" width="15" height="46" rx="7"  fill="${c['right-index']}"  data-finger="right-index"/>
            <rect x="36" y="15" width="15" height="54" rx="7"  fill="${c['right-middle']}" data-finger="right-middle"/>
            <rect x="54" y="22" width="15" height="47" rx="7"  fill="${c['right-ring']}"   data-finger="right-ring"/>
            <rect x="72" y="35" width="15" height="34" rx="7"  fill="${c['right-pinky']}"  data-finger="right-pinky"/>
            <rect x="-1" y="72" width="22" height="12" rx="6"  fill="${thumb}" transform="rotate(35 21 78)"/>
        </svg>`;
    }

    const wrap = document.createElement('div');
    wrap.className = 'hand-wrapper';
    wrap.innerHTML = svg + `<div class="hand-label">${isLeft ? 'LEFT' : 'RIGHT'}</div>`;
    return wrap;
}

const kbLegend = document.createElement('div');
kbLegend.className = 'kb-legend';
kbLegend.appendChild(buildKeyboard());

const handsRow = document.createElement('div');
handsRow.className = 'kb-hands';
handsRow.appendChild(buildHand('left'));
handsRow.appendChild(buildHand('right'));
kbLegend.appendChild(handsRow);

legendBox.innerHTML = '';
legendBox.appendChild(kbLegend);

export function highlightLegendKey(ch) {
    legendBox.querySelectorAll('.kb-key').forEach(k => k.classList.remove('kb-active'));
    legendBox.querySelectorAll('[data-finger]').forEach(r => r.classList.remove('finger-active'));
    if (!ch) return;
    const keyAttr = ch === ' ' ? 'space' : ch.toLowerCase();
    legendBox.querySelector(`.kb-key[data-key="${keyAttr}"]`)?.classList.add('kb-active');
    const finger = fingerMap[ch.toLowerCase()];
    if (finger) legendBox.querySelectorAll(`[data-finger="${finger}"]`).forEach(r => r.classList.add('finger-active'));
}
