import { virtualWidth, virtualHeight } from '../../config.js';
/**
 * InputManager – Tracks mouse position.
 * Exported as a singleton `input`.
 */
class InputManager {
    mouse;
    constructor() {
        this.mouse = {
            x: virtualWidth / 2,
            y: virtualHeight / 2,
        };
        window.addEventListener('mousemove', (e) => {
            const canvas = document.getElementById('c');
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    const rawX = ((e.clientX - rect.left) / rect.width) * canvas.width;
                    const rawY = ((e.clientY - rect.top) / rect.height) * canvas.height;
                    this.mouse.x = Math.max(0, Math.min(canvas.width, rawX));
                    this.mouse.y = Math.max(0, Math.min(canvas.height, rawY));
                }
            }
            else {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            }
        });
    }
}
export const input = new InputManager();
//# sourceMappingURL=InputManager.js.map