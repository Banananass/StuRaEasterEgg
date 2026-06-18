import {GameObject} from './Engine/GameObject.js';
import {ParticleSystem} from './ParticleSystem.js';
import {Engine} from './Engine/Engine.js';
import {Beaver} from './Beaver.js';
import {ScoreManager} from './ScoreManager.js';

const COLLECT_TIME: number = 5000; // ms to fully collect
const JUICEBOX_R: number = 15;   // hitbox radius
const COLLECT_RADIUS: number = JUICEBOX_R + 20;
const FADE_SPEED: number = 0.04; // alpha decrease per frame
const SPAWN_INTERVAL_MIN: number = 3000;
const SPAWN_INTERVAL_MAX: number = 7000;

/**
 * Juicebox – collectable item.
 * Proximity detection runs in update(); fixedUpdate() is unused here.
 */
export class Juicebox extends GameObject {
    public beaver: Beaver;
    public scoreManager: ScoreManager;
    private _spawnTimeout: ReturnType<typeof setTimeout> | null;

    public overlap_ms: number;
    public collected: boolean;
    public alpha: number;
    public active: boolean;

    constructor(engine: Engine, beaver: Beaver, scoreManager: ScoreManager) {
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

    override start(): void {
        this._spawn();
    }

    // ── Internal helpers ───────────────────────────────────────────────────

    private _spawn(): void {
        const margin: number = 60;
        const {width, height}: { width: number; height: number } = this.Engine.canvas;

        this.position.x = margin + Math.random() * (width - margin * 2);
        this.position.y = margin + Math.random() * (height - margin * 2);
        this.overlap_ms = 0;
        this.collected = false;
        this.alpha = 1;
        this.active = true;
    }

    private _scheduleSpawn(): void {
        const delay: number = SPAWN_INTERVAL_MIN +
            Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);
        this._spawnTimeout = setTimeout(() => this._spawn(), delay);
    }

    // ── Lifecycle ──────────────────────────────────────────────────────────

    override update(dt: number): void {
        if (!this.active) return;

        if (!this.collected) {
            // ── Proximity check ────────────────────────────────────────
            const dist: number = Math.hypot(this.beaver.position.x - this.position.x, this.beaver.position.y - this.position.y);

            if (dist < COLLECT_RADIUS) {
                this.overlap_ms += dt;

                if (this.overlap_ms >= COLLECT_TIME) {
                    this.collected = true;
                    this.scoreManager.addScore(1);

                    // Spawn burst particles at collection position
                    new ParticleSystem(this.Engine, this.position.x, this.position.y);
                }
            } else {
                // Slowly reset progress when the beaver moves away
                this.overlap_ms = Math.max(0, this.overlap_ms - dt * 1.5);
            }
        } else {
            // ── Fade out after collection ──────────────────────────────
            this.alpha -= FADE_SPEED;
            if (this.alpha <= 0) {
                this.active = false;
                this._scheduleSpawn();
            }
        }
    }

    /** @param {CanvasRenderingContext2D} ctx */
    override draw(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;

        const {overlap_ms, alpha}: { overlap_ms: number; alpha: number } = this;
        const {x, y} = this.position;
        const progress: number = Math.min(overlap_ms / COLLECT_TIME, 1);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);

        // Placeholder: magenta rectangle labelled "JUICE"
        const bw: number = 36;
        const bh: number = 50;
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
            ctx.arc(0, 0, JUICEBOX_R + 8,
                -Math.PI / 2,
                -Math.PI / 2 + Math.PI * 2 * progress);
            ctx.stroke();
        }

        ctx.restore();
    }

    override destroy(): void {
        if (this._spawnTimeout) {
            clearTimeout(this._spawnTimeout);
        }
        super.destroy();
    }
}



