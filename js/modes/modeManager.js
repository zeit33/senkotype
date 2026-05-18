const registry = {};
let active = null;

export function registerMode(mode) {
    registry[mode.id] = mode;
}

export function setMode(id) {
    if (active) active.deactivate();
    active = registry[id];
    const container = document.getElementById('mode-settings-area');
    if (container) {
        container.innerHTML = '';
        active.activate(container);
    }
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === id);
    });
}

export function getMode() {
    return active;
}
