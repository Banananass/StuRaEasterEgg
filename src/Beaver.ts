import {GameObject} from './Engine/GameObject.js';
import {input} from './Engine/InputManager.js';

const INITIAL_SPEED: number = 1;
const INITIAL_SIZE: number = 50;
const ROTATION_LERP: number = 0.05;
const MIN_MOVE_DIST: number = 2;

/**
 * Beaver – player-controlled character that follows the mouse cursor.
 * Movement & rotation are handled in update(); nothing needs fixedUpdate here.
 */
export class Beaver extends GameObject {
    public speed: number = INITIAL_SPEED;
    public size: number = INITIAL_SIZE;
    private image!: HTMLImageElement;

    override start(): void {
        this.layer = 2;
        this.position.x = this.Engine.canvas.width / 2;
        this.position.y = this.Engine.canvas.height / 2;

        this.image = new Image();
        this.image.src = 'resources/beaver.png';
    }

    override update(dt: number): void {
        const {x: mx, y: my}: { x: number; y: number } = input.mouse;

        // ── Move toward mouse ────────────────────────────────────────────
        const dx: number = mx - this.position.x;
        const dy: number = my - this.position.y;
        const dist: number = Math.hypot(dx, dy);

        if (dist > this.speed) {
            this.position.x += (dx / dist) * this.speed;
            this.position.y += (dy / dist) * this.speed;
        } else {
            this.position.x = mx;
            this.position.y = my;
        }

        // ── Rotate ───────────────────────────────────────────────────────
        const adx: number = mx - this.position.x;
        const ady: number = my - this.position.y;
        const targetAngle: number = Math.hypot(adx, ady) > MIN_MOVE_DIST
            ? Math.atan2(ady, adx) + Math.PI / 2
            : 0; // turn upright when standing still

        let da: number = targetAngle - this.rotation;
        while (da > Math.PI) da -= Math.PI * 2;
        while (da < -Math.PI) da += Math.PI * 2;
        this.rotation += da * ROTATION_LERP;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    override draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);

        ctx.drawImage(this.image, -this.size/2, -this.size/2, this.size, this.size);

        ctx.restore();
    }
}

