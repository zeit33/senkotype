import { fingerMap, fingerColors } from './fingerData.js';
import { sequenceDisplay } from './ui.js';

export function renderSequence(sequence, opts = {}) {
    sequenceDisplay.innerHTML = "";

    const useFingerColors = opts.fingerColors ?? false;

    for (const letter of sequence) {
        const span = document.createElement("span");
        if (letter === ' ') {
            span.textContent = '·';
            span.classList.add('char-space');
        } else {
            span.textContent = letter;
        }

        const finger = fingerMap[letter];

        if (!finger) {
            span.style.color = "rgba(255,255,255,0.45)";
        } else if (useFingerColors) {
            span.style.color = fingerColors[finger];
        } else {
            span.style.color = finger.includes("left") ? "#67ff67" : "#ff5c5c";
        }

        sequenceDisplay.appendChild(span);
    }
}
