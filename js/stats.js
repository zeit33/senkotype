const counts = {
    letters:   0,
    words:     0,
    sequences: 0,
    mistakes:  0,
    broken:    0,
};

const els = {};

export function initStats() {
    for (const key of Object.keys(counts)) {
        els[key] = document.getElementById('stat-' + key);
    }
}

function tick(key) {
    if (els[key]) els[key].textContent = counts[key].toLocaleString();
}

export function recordLetter() {
    counts.letters++;
    tick('letters');
}

export function recordWord(sequence) {
    const words = sequence.trim() ? sequence.trim().split(/\s+/).length : 0;
    counts.words += words;
    tick('words');
}

export function recordSequence() {
    counts.sequences++;
    tick('sequences');
}

export function recordMistake() {
    counts.mistakes++;
    tick('mistakes');
}

export function recordBreak() {
    counts.broken++;
    tick('broken');
}

export function getMistakes() {
    return counts.mistakes;
}

export function resetStats() {
    for (const key of Object.keys(counts)) {
        counts[key] = 0;
        if (els[key]) els[key].textContent = '0';
    }
}
