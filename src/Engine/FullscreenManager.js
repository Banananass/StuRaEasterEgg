/**
 * FullscreenManager – toggles browser fullscreen for the game.
 *
 * Note: when embedded in a cross-origin iframe, the Fullscreen API only works
 * if the parent page's <iframe> tag has the `allowfullscreen` attribute (and
 * ideally `allow="fullscreen"`). Without that, requestFullscreen() will
 * silently reject.
 */
export class FullscreenManager {
    button;
    constructor(buttonId) {
        this.button = document.getElementById(buttonId);
        if (!this.button)
            return;
        this.button.addEventListener('click', () => this.toggle());
        document.addEventListener('fullscreenchange', () => this.updateButton());
        document.addEventListener('webkitfullscreenchange', () => this.updateButton());
        this.updateButton();
    }
    get fullscreenElement() {
        const doc = document;
        return doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement || null;
    }
    toggle() {
        if (!this.fullscreenElement) {
            const el = document.documentElement;
            const request = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            if (!request) {
                console.warn('Fullscreen API not supported.');
                return;
            }
            const result = request.call(el);
            if (result && typeof result.catch === 'function') {
                result.catch((err) => {
                    console.warn('Fullscreen request was denied (the embedding page may be missing the "allowfullscreen" attribute on its <iframe>):', err);
                });
            }
        }
        else {
            const doc = document;
            const exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
            if (exit)
                exit.call(doc);
        }
    }
    updateButton() {
        const isFullscreen = !!this.fullscreenElement;
        this.button.textContent = isFullscreen ? '⤡' : '⛶';
        this.button.title = isFullscreen ? 'Vollbild verlassen' : 'Vollbild';
        this.button.classList.toggle('active', isFullscreen);
    }
}
//# sourceMappingURL=FullscreenManager.js.map