import { scoreElement, highScoreEl } from './ui.js';

let currentScore   = 0;
let displayedScore = 0;
let highScore      = parseInt(localStorage.getItem("highScore") || "0");

highScoreEl.textContent = highScore.toLocaleString();

export function addScore(amount) {
    currentScore += amount;

    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem("highScore", highScore);
        highScoreEl.textContent = highScore.toLocaleString();
    }

    scoreElement.classList.add("bump");
    setTimeout(() => scoreElement.classList.remove("bump"), 120);
}

export function resetScore() {
    currentScore   = 0;
    displayedScore = 0;
}

function animateScore() {
    displayedScore += (currentScore - displayedScore) * 0.08;

    if (Math.abs(currentScore - displayedScore) < 0.5) {
        displayedScore = currentScore;
    }

    scoreElement.textContent = Math.floor(displayedScore).toLocaleString();
    requestAnimationFrame(animateScore);
}

animateScore();
