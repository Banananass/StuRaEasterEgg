import {GameObject} from './Engine/GameObject.js';
import {Engine} from './Engine/Engine.js';
import {JuiceboxSpawner} from './JuiceboxSpawner.js';
import {ScoreManager} from "./ScoreManager.js";
import {ParticleSystem} from "./ParticleSystem.js";
import {Time} from "./Engine/Time.js";
import {Coroutine} from "./Engine/Coroutine.js";

const CIRCLE_RADIUS: number = 25;
const FADE_SPEED: number = 0.04;

const INITIAL_COLLECTING_TIME: number = 5000; // ms to fully collect

/**
 * Juicebox – collectable item.
 * When collected, it increases the score and spawns a burst of particles.
 */
export class Juicebox extends GameObject {
    public overlap_ms: number = 0;
    public collected: boolean = false;
    public alpha: number = 1;
    public collectingTime: number = INITIAL_COLLECTING_TIME;

    private collectingCoroutineRef: Coroutine | null = null;
    private unCollectingCoroutineRef: Coroutine | null = null;

    private readonly spawner?: JuiceboxSpawner;


    constructor(spawner?: JuiceboxSpawner) {
        super();
        this.spawner = spawner;
        this.layer = 1;

        const margin: number = 60;
        const {width, height}: { width: number; height: number } = Engine.Instance.canvas;

        this.position.x = margin + Math.random() * (width - margin * 2);
        this.position.y = margin + Math.random() * (height - margin * 2);
    }

    startCollecting(): void {
        if(this.collected) return;
        if(this.unCollectingCoroutineRef != null){
            this.stopCoroutine(this.unCollectingCoroutineRef);
            this.unCollectingCoroutineRef = null;
        }
        this.collectingCoroutineRef ??= this.startCoroutine(this.collectingCoroutine());
    }

    stopCollecting(): void {
        if(this.collected) return;
        if(this.collectingCoroutineRef != null){
            this.stopCoroutine(this.collectingCoroutineRef);
            this.collectingCoroutineRef = null;
        }
        this.unCollectingCoroutineRef ??= this.startCoroutine(this.unCollectingCoroutine());
    }

    * collectingCoroutine() {
        while (this.overlap_ms < this.collectingTime) {
            this.overlap_ms += Time.deltaTimeMs;
            yield null;
        }
        this.startCoroutine(this.fadeOutAndDestroyCoroutine())
        this.collectingCoroutineRef = null;
    }

    * unCollectingCoroutine() {
        while (this.overlap_ms > 0) {
            this.overlap_ms -= Time.deltaTimeMs;
            yield null;
        }
        this.unCollectingCoroutineRef = null;
    }

    * fadeOutAndDestroyCoroutine() {
        this.collected = true;
        while (this.alpha > 0) {
            this.alpha = Math.max(0, this.alpha - FADE_SPEED);
            yield null;
        }
        this.destroy();
    }

    /** @param {CanvasRenderingContext2D} ctx */
    override draw(ctx: CanvasRenderingContext2D): void {
        const {overlap_ms, alpha}: { overlap_ms: number; alpha: number } = this;
        const {x, y} = this.position;
        const progress: number = Math.min(overlap_ms / this.collectingTime, 1);

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
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
            ctx.arc(0, 0, CIRCLE_RADIUS,
                -Math.PI / 2,
                -Math.PI / 2 + Math.PI * 2 * progress);
            ctx.stroke();
        }

        ctx.restore();
    }

    override destroy(): void {
        new ParticleSystem(this.position.x, this.position.y);
        ScoreManager.Instance.addScore(1);
        if (this.spawner) this.spawner.onJuiceboxDestroyed(this);
        super.destroy();
    }
}





