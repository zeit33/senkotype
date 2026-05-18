import { fingerMap, fingerColors } from './fingerData.js';
import { sequenceDisplay, highlightLegendKey } from './ui.js';
import { timingState } from './timingSettings.js';

export const WINDOW_SIZE = 15;

export function makeCharSpan(ch) {
    const span = document.createElement('span');
    if (ch === ' ') {
        span.textContent = '·';
        span.classList.add('char-space');
    } else {
        span.textContent = ch;
    }
    const finger = fingerMap[ch];
    if (!finger) {
        span.style.color = 'rgba(255,255,255,0.45)';
    } else if (timingState.fingerColors) {
        span.style.color = fingerColors[finger];
    } else {
        span.style.color = finger.includes('left') ? '#67ff67' : '#ff5c5c';
    }
    return span;
}

export function spawnParticles(span) {
    const rect  = span.getBoundingClientRect();
    const color = span.style.color || 'rgba(255,255,255,0.7)';
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    for (let i = 0; i < 8; i++) {
        const p     = document.createElement('div');
        p.className = 'char-particle';
        const angle = (Math.PI * 2 * i / 8) + (Math.random() - 0.5) * 0.6;
        const dist  = 18 + Math.random() * 32;
        const dx    = Math.cos(angle) * dist;
        const dy    = Math.sin(angle) * dist + 45 + Math.random() * 55;
        p.style.left              = cx + 'px';
        p.style.top               = cy + 'px';
        p.style.background        = color;
        p.style.width             = (2 + Math.floor(Math.random() * 3)) + 'px';
        p.style.height            = (1 + Math.floor(Math.random() * 2)) + 'px';
        p.style.animationDuration = (0.38 + Math.random() * 0.22) + 's';
        p.style.setProperty('--pdx', dx.toFixed(1) + 'px');
        p.style.setProperty('--pdy', dy.toFixed(1) + 'px');
        document.body.appendChild(p);
        p.addEventListener('animationend', () => p.remove(), { once: true });
    }
}

export function renderWindow(text, startIdx) {
    sequenceDisplay.innerHTML = '';
    const end = Math.min(startIdx + WINDOW_SIZE, text.length);
    for (let i = startIdx; i < end; i++) {
        const span = makeCharSpan(text[i]);
        if (i === startIdx) span.classList.add('char-current');
        sequenceDisplay.appendChild(span);
    }
}

export function slidingRoundStart(text, startIdx = 0) {
    sequenceDisplay.classList.add('text-mode');
    renderWindow(text, startIdx);
    highlightLegendKey(text[startIdx] ?? '');
}

export function slidingCharTyped(typedCount, text, baseOffset, chunkLen) {
    if (typedCount >= chunkLen) {
        // Spawn particles on the last visible char; onRoundStart will clear the display
        const last = sequenceDisplay.firstElementChild;
        if (last) spawnParticles(last);
        return;
    }
    const outgoing = sequenceDisplay.firstElementChild;
    if (outgoing) {
        spawnParticles(outgoing);
        outgoing.remove();
        const newFirst = sequenceDisplay.firstElementChild;
        if (newFirst) {
            sequenceDisplay.querySelector('.char-current')?.classList.remove('char-current');
            newFirst.classList.add('char-current');
        }
    }
    const newIdx = baseOffset + typedCount - 1 + WINDOW_SIZE;
    if (newIdx < text.length) {
        const span = makeCharSpan(text[newIdx]);
        span.classList.add('char-in');
        sequenceDisplay.appendChild(span);
    }
    highlightLegendKey(text[baseOffset + typedCount] ?? '');
}

export function slidingDeactivate() {
    sequenceDisplay.classList.remove('text-mode');
    highlightLegendKey('');
}
