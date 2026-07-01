/**
 * Engine – Core game loop (Unity-like)
 *
 * Lifecycle per registered GameObject:
 *   awake()        – called once on object creation
 *   start()        – called once before the first frame
 *   update(dt)     – called every rendered frame (dt in ms)
 *   fixedUpdate()  – called at a fixed fps rate
 *   draw(ctx)      – called every rendered frame after update
 */
import {GameObject} from "./GameObject.js";
import {fixedUpdatePerSecond, maxFrameTime, virtualHeight, virtualWidth} from "../../config.js";
import {Coroutine} from "./Coroutine.js";
import {Time} from "./Time.js";

export class Engine {

    private readonly _canvas: HTMLCanvasElement;
    private readonly _ctx: CanvasRenderingContext2D;
    private readonly objects: Set<GameObject> = new Set<GameObject>();
    private readonly pendingAdd: Set<GameObject> = new Set<GameObject>();
    private readonly activeCoroutines: Set<{ coroutine: Coroutine, owner?: GameObject }> = new Set();

    private lastTime: number = 0;
    private fixedAccumulator: number = 0;
    private readonly fixedDt: number = 1000 / fixedUpdatePerSecond;
    private running: boolean = false;

    public backgroundColor: string;

    private static instance: Engine;

    private constructor(canvasId: string) {
        this._canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this._ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D;
        this.backgroundColor = '#888';

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    get ctx(): CanvasRenderingContext2D {
        return this._ctx;
    }

    public static get Instance(): Engine {
        return this.instance || (this.instance = new this('c'));
    }

    // ── Object management ───────────────────────────────────────────────────

    /**
     * Register a GameObject with the engine.
     * If the engine is already running, start() is called immediately.
     */
    public addObject<T extends GameObject>(go: T) {
        if (this.running) {
            this.pendingAdd.add(go);
        } else {
            this.objects.add(go);
        }
    }

    public removeObject(go: GameObject): void {
        this.objects.delete(go);
        this.pendingAdd.delete(go);
    }

    // ── Coroutines ──────────────────────────────────────────────────────────

    /**
     * Start a coroutine associated with the engine (globally or on behalf of a GameObject).
     * Runs immediately up to its first yield statement.
     */
    public startCoroutine(routine: Generator<any, any, any>, owner?: GameObject): Coroutine {
        const coroutine = new Coroutine(routine);

        // Run first step synchronously
        const running = coroutine.update(0);
        if (running) {
            this.activeCoroutines.add({coroutine, owner});
        }
        return coroutine;
    }

    public stopCoroutine(coroutine: Coroutine): void {
        for (const entry of this.activeCoroutines) {
            if (entry.coroutine === coroutine) {
                coroutine.stop();
                this.activeCoroutines.delete(entry);
                break;
            }
        }
    }

    public stopAllCoroutines(owner?: GameObject): void {
        for (const entry of this.activeCoroutines) {
            if (owner === undefined || entry.owner === owner) {
                entry.coroutine.stop();
                this.activeCoroutines.delete(entry);
            }
        }
    }

    // ── Lifecycle ───────────────────────────────────────────────────────────

    /** Calls start() on all registered objects and begins the render loop. */
    public start(): void {
        console.log(`Starting engine with ${this.objects.size} objects...`);
        this.running = true;
        for (const go of this.objects) go.start();
        requestAnimationFrame((ts: number) => this.loop(ts));
    }

    // ── Private ─────────────────────────────────────────────────────────────

    private resize(): void {
        this._canvas.width = virtualWidth;
        this._canvas.height = virtualHeight;

        // When embedded in an iframe, the parent page controls the iframe's height via CSS
        // (typically height: 100% of a container without an intrinsic height). Since we can't
        // know that height from here, we instead tell the parent how tall the iframe needs to
        // be (based on the width it was given) in order to keep the 16:9 aspect ratio.
        if (window.self !== window.top && window.parent) {
            const desiredHeight = Math.round(window.innerWidth * (virtualHeight / virtualWidth));
            window.parent.postMessage({type: 'setHeight', height: desiredHeight}, '*');
        }
    }

    /** @param {number} ts – DOMHighResTimeStamp from rAF */
    private loop(ts: number): void {
        requestAnimationFrame((ts2: number) => this.loop(ts2));

        // Flush newly added objects
        for (const go of this.pendingAdd) {
            this.objects.add(go);
            go.start();
        }
        this.pendingAdd.clear();

        const dt: number = Math.min(ts - this.lastTime, maxFrameTime);
        this.lastTime = ts;

        // Update global Time metrics
        Time.update(dt);

        // ── Update Coroutines ──────────────────────────────────────────────
        const coroutinesToUpdate = [...this.activeCoroutines];
        for (const entry of coroutinesToUpdate) {
            if (!this.activeCoroutines.has(entry)) continue;

            const owner = entry.owner;
            if (owner && owner.Destroyed) {
                entry.coroutine.stop();
                this.activeCoroutines.delete(entry);
                continue;
            }

            if (owner && !owner.enabled) {
                continue;
            }

            const running = entry.coroutine.update(dt);
            if (!running) {
                this.activeCoroutines.delete(entry);
            }
        }

        // ── Fixed update ──────────────────────────────────────────
        this.fixedAccumulator += dt;
        while (this.fixedAccumulator >= this.fixedDt) {
            for (const go of this.objects)
                if (!go.Destroyed && go.enabled) go.fixedUpdate();
            this.fixedAccumulator -= this.fixedDt;
        }

        // ── Clear canvas ───────────────────────────────────────────────────
        this._ctx.fillStyle = this.backgroundColor;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

        // ── Update + draw (snapshot so mid-frame removals are safe) ────────
        const snapshot: GameObject[] = [...this.objects];
        for (const go of snapshot) if (!go.Destroyed && go.enabled) go.update();

        // Sort by layer ascending so that higher layers are rendered on top
        const renderSnapshot: GameObject[] = snapshot
            .filter(go => !go.Destroyed && go.enabled)
            .sort((a, b) => a.layer - b.layer);

        for (const go of renderSnapshot) go.draw(this._ctx);
    }
}



