let _interval = null;
let _timeout  = null;

const COLORS = ['#ff5c5c', '#5cff72', '#a7f3ff', '#ffd700', '#ff69b4', '#ff8c00', '#c084fc', '#34d399'];

export function launchFireworks(durationMs = 5000) {
    stopFireworks();
    const overlay = document.createElement('div');
    overlay.id = 'fireworks-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:10000;overflow:hidden;';
    document.body.appendChild(overlay);
    spawnBurst(overlay);
    _interval = setInterval(() => spawnBurst(overlay), 350);
    _timeout  = setTimeout(stopFireworks, durationMs);
}

export function stopFireworks() {
    clearInterval(_interval);
    clearTimeout(_timeout);
    _interval = _timeout = null;
    document.getElementById('fireworks-overlay')?.remove();
}

function spawnBurst(container) {
    const x  = 5 + Math.random() * 90;
    const y  = 5 + Math.random() * 70;
    const c1 = COLORS[Math.floor(Math.random() * COLORS.length)];
    const c2 = COLORS[Math.floor(Math.random() * COLORS.length)];
    const n  = 18 + Math.floor(Math.random() * 8);
    for (let i = 0; i < n; i++) {
        const p     = document.createElement('div');
        p.className = 'fw-particle';
        const angle = (Math.PI * 2 * i / n) + (Math.random() - 0.5) * 0.3;
        const speed = 50 + Math.random() * 90;
        const dx    = Math.cos(angle) * speed;
        const dy    = Math.sin(angle) * speed + 30 + Math.random() * 40;
        p.style.left              = x + 'vw';
        p.style.top               = y + 'vh';
        p.style.background        = i % 2 === 0 ? c1 : c2;
        p.style.width             = (3 + Math.floor(Math.random() * 4)) + 'px';
        p.style.height            = (3 + Math.floor(Math.random() * 4)) + 'px';
        p.style.borderRadius      = Math.random() > 0.5 ? '50%' : '1px';
        p.style.animationDuration = (0.7 + Math.random() * 0.6) + 's';
        p.style.setProperty('--fdx', dx + 'px');
        p.style.setProperty('--fdy', dy + 'px');
        container.appendChild(p);
        p.addEventListener('animationend', () => p.remove(), { once: true });
    }
}
