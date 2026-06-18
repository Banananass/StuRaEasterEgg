import { GameObject } from './Engine/GameObject.js';
import { ParticleSystem } from './ParticleSystem.js';
const COLLECT_TIME = 5000; // ms to fully collect
const JUICEBOX_R = 15; // hitbox radius
const COLLECT_RADIUS = JUICEBOX_R + 20;
const FADE_SPEED = 0.04; // alpha decrease per frame
const SPAWN_INTERVAL_MIN = 3000;
const SPAWN_INTERVAL_MAX = 7000;
/**
 * Juicebox – collectable item.
 * Proximity detection runs in update(); fixedUpdate() is unused here.
 */
export class Juicebox extends GameObject {
    beaver;
    scoreManager;
    _spawnTimeout;
    overlap_ms;
    collected;
    alpha;
    active;
    constructor(engine, beaver, scoreManager) {
        super(engine);
        this.beaver = beaver;
        this.scoreManager = scoreManager;
        this._spawnTimeout = null;
        this.layer = 1;
        // State – initialised in start() / _spawn()
        this.overlap_ms = 0;
        this.collected = false;
        this.alpha = 1;
        this.active = false;
    }
    start() {
        this._spawn();
    }
    // ── Internal helpers ───────────────────────────────────────────────────
    _spawn() {
        const margin = 60;
        const { width, height } = this.Engine.canvas;
        this.position.x = margin + Math.random() * (width - margin * 2);
        this.position.y = margin + Math.random() * (height - margin * 2);
        this.overlap_ms = 0;
        this.collected = false;
        this.alpha = 1;
        this.active = true;
    }
    _scheduleSpawn() {
        const delay = SPAWN_INTERVAL_MIN +
            Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);
        this._spawnTimeout = setTimeout(() => this._spawn(), delay);
    }
    // ── Lifecycle ──────────────────────────────────────────────────────────
    update(dt) {
        if (!this.active)
            return;
        if (!this.collected) {
            // ── Proximity check ────────────────────────────────────────
            const dist = Math.hypot(this.beaver.position.x - this.position.x, this.beaver.position.y - this.position.y);
            if (dist < COLLECT_RADIUS) {
                this.overlap_ms += dt;
                if (this.overlap_ms >= COLLECT_TIME) {
                    this.collected = true;
                    this.scoreManager.addScore(1);
                    // Spawn burst particles at collection position
                    new ParticleSystem(this.Engine, this.position.x, this.position.y);
                }
            }
            else {
                // Slowly reset progress when the beaver moves away
                this.overlap_ms = Math.max(0, this.overlap_ms - dt * 1.5);
            }
        }
        else {
            // ── Fade out after collection ──────────────────────────────
            this.alpha -= FADE_SPEED;
            if (this.alpha <= 0) {
                this.active = false;
                this._scheduleSpawn();
            }
        }
    }
    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        if (!this.active)
            return;
        const { overlap_ms, alpha } = this;
        const { x, y } = this.position;
        const progress = Math.min(overlap_ms / COLLECT_TIME, 1);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);
        // Placeholder: magenta rectangle labelled "JUICE"
        const bw = 36;
        const bh = 50;
        ctx.fillStyle = '#cc00cc';
        ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('JUICE', 0, 0);
        // Collection progress ring
        if (progress > 0) {
            ctx.strokeStyle = `hsl(${120 * progress}, 90%, 55%)`;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, JUICEBOX_R + 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
            ctx.stroke();
        }
        ctx.restore();
    }
    destroy() {
        if (this._spawnTimeout) {
            clearTimeout(this._spawnTimeout);
        }
        super.destroy();
    }
}
//# sourceMappingURL=Juicebox.js.map