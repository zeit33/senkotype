import { catalog, DEFAULT_CHARACTER } from './characters.js';

let activeCharacter = DEFAULT_CHARACTER;
let baseMood        = "idle";
let wonderingTimer  = null;

const img = document.getElementById("characterImg");

export function setCharacter(name) {
    if (!catalog[name]) return;
    activeCharacter = name;
    applyMood(baseMood);
}

// "wondering" is transient — reverts to baseMood after a short delay.
// All other moods become the new baseMood.
export function setMood(mood) {
    if (mood === "wondering") {
        applyMood("wondering");
        clearTimeout(wonderingTimer);
        wonderingTimer = setTimeout(() => applyMood(baseMood), 3000);
        return;
    }
    clearTimeout(wonderingTimer);
    baseMood = mood;
    applyMood(mood);
}

function applyMood(mood) {
    const char = catalog[activeCharacter];
    if (!char || !char.moods[mood]) return;
    img.src = char.moods[mood];
}


export function calculateMood(currentSequenceCount) {
    let totalMoods = 2;
    if (currentSequenceCount >= 10)
        totalMoods = 3;

        let mood = "idle";

        const random = Math.floor(Math.random() * totalMoods);
        switch (random) {
            case 0:
                mood = "idle";
                break;
            case 1:
                mood = "good";
                break;
            case 2:
                mood = "happy";
                break;
            case 3:
                mood = "surprised";
                break;
            case 4:
                mood = "excited";
                break;
        }
        setMood(mood);
    } 
