import { fixedUpdatePerSecond, maxFrameTime, virtualHeight, virtualWidth } from "../../config.js";
export class Engine {
    _canvas;
    _ctx;
    objects = new Set();
    pendingAdd = new Set();
    lastTime = 0;
    fixedAccumulator = 0;
    fixedDt = 1000 / fixedUpdatePerSecond;
    running = false;
    backgroundColor;
    constructor(canvasId) {
        this._canvas = document.getElementById(canvasId);
        this._ctx = this._canvas.getContext('2d');
        this.backgroundColor = '#888';
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    // ── Public getters ──────────────────────────────────────────────────────
    get canvas() {
        return this._canvas;
    }
    get ctx() {
        return this._ctx;
    }
    // ── Object management ───────────────────────────────────────────────────
    /**
     * Register a GameObject with the engine.
     * If the engine is already running, start() is called immediately.
     */
    addObject(go) {
        if (this.running) {
            this.pendingAdd.add(go);
        }
        else {
            this.objects.add(go);
        }
    }
    removeObject(go) {
        this.objects.delete(go);
        this.pendingAdd.delete(go);
    }
    // ── Lifecycle ───────────────────────────────────────────────────────────
    /** Calls start() on all registered objects and begins the render loop. */
    start() {
        console.log(`Starting engine with ${this.objects.size} objects...`);
        this.running = true;
        for (const go of this.objects)
            go.start();
        requestAnimationFrame((ts) => this.loop(ts));
    }
    // ── Private ─────────────────────────────────────────────────────────────
    resize() {
        this._canvas.width = virtualWidth;
        this._canvas.height = virtualHeight;
    }
    /** @param {number} ts – DOMHighResTimeStamp from rAF */
    loop(ts) {
        requestAnimationFrame((ts2) => this.loop(ts2));
        // Flush newly added objects
        for (const go of this.pendingAdd) {
            this.objects.add(go);
            go.start();
        }
        this.pendingAdd.clear();
        const dt = Math.min(ts - this.lastTime, maxFrameTime);
        this.lastTime = ts;
        // ── Fixed update (50 fps) ──────────────────────────────────────────
        this.fixedAccumulator += dt;
        while (this.fixedAccumulator >= this.fixedDt) {
            for (const go of this.objects)
                if (!go.Destroyed && go.enabled)
                    go.fixedUpdate();
            this.fixedAccumulator -= this.fixedDt;
        }
        // ── Clear canvas ───────────────────────────────────────────────────
        this._ctx.fillStyle = this.backgroundColor;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        // ── Update + draw (snapshot so mid-frame removals are safe) ────────
        const snapshot = [...this.objects];
        for (const go of snapshot)
            if (!go.Destroyed && go.enabled)
                go.update(dt);
        // Sort by layer ascending so that higher layers are rendered on top
        const renderSnapshot = snapshot
            .filter(go => !go.Destroyed && go.enabled)
            .sort((a, b) => a.layer - b.layer);
        for (const go of renderSnapshot)
            go.draw(this._ctx);
    }
}
//# sourceMappingURL=Engine.js.map