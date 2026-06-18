import { GameObject } from './Engine/GameObject.js';
import { input } from './Engine/InputManager.js';
const INITIAL_SPEED = 1;
const INITIAL_SIZE = 50;
const ROTATION_LERP = 0.05;
const MIN_MOVE_DIST = 2;
/**
 * Beaver – player-controlled character that follows the mouse cursor.
 * Movement & rotation are handled in update(); nothing needs fixedUpdate here.
 */
export class Beaver extends GameObject {
    speed = INITIAL_SPEED;
    size = INITIAL_SIZE;
    image;
    start() {
        this.layer = 2;
        this.position.x = this.Engine.canvas.width / 2;
        this.position.y = this.Engine.canvas.height / 2;
        this.image = new Image();
        this.image.src = 'resources/beaver.png';
    }
    update(dt) {
        const { x: mx, y: my } = input.mouse;
        // ── Move toward mouse ────────────────────────────────────────────
        const dx = mx - this.position.x;
        const dy = my - this.position.y;
        const dist = Math.hypot(dx, dy);
        if (dist > this.speed) {
            this.position.x += (dx / dist) * this.speed;
            this.position.y += (dy / dist) * this.speed;
        }
        else {
            this.position.x = mx;
            this.position.y = my;
        }
        // ── Rotate ───────────────────────────────────────────────────────
        const adx = mx - this.position.x;
        const ady = my - this.position.y;
        const targetAngle = Math.hypot(adx, ady) > MIN_MOVE_DIST
            ? Math.atan2(ady, adx) + Math.PI / 2
            : 0;
        let da = targetAngle - this.rotation;
        while (da > Math.PI)
            da -= Math.PI * 2;
        while (da < -Math.PI)
            da += Math.PI * 2;
        this.rotation += da * ROTATION_LERP;
    }
    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}
//# sourceMappingURL=Beaver.js.map