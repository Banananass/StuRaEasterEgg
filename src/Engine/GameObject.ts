import {Engine} from "./Engine.js";
import {Vector2} from "./Vector2.js";
import {Coroutine} from "./Coroutine.js";

/**
 * GameObject – Base class for all game entities.
 */
export abstract class GameObject {
    private destroyed: boolean;
    public enabled: boolean;

    public position: Vector2;
    public rotation: number;
    public scale: Vector2;
    public layer: number;

    get Destroyed(): boolean {
        return this.destroyed;
    }

    constructor() {
        this.destroyed = false;
        this.enabled = true;
        this.position = new Vector2(0, 0);
        this.rotation = 0;
        this.scale = new Vector2(1, 1);
        this.layer = 0;
        this.awake();
        Engine.Instance.addObject(this);
    }

    /** Called on object creation. */
    awake(): void {
    }

    /** Called once before the first frame. */
    start(): void {
    }

    /**
     * Called every rendered frame.
     */
    update(): void {
    }

    /** Called at a fixed 50 fps rate (every 20 ms). */
    fixedUpdate(): void {
    }

    /**
     * Called every rendered frame after update().
     * @param ctx
     */
    draw(ctx: CanvasRenderingContext2D): void {
    }

    // ── Coroutines (Unity-like) ──────────────────────────────────────────────

    /**
     * Start a coroutine bound to this GameObject.
     * The coroutine will automatically pause when this object is disabled,
     * and terminate when this object is destroyed.
     */
    public startCoroutine(routine: Generator<any, any, any>): Coroutine {
        return Engine.Instance.startCoroutine(routine, this);
    }

    public stopCoroutine(coroutine: Coroutine): void {
        Engine.Instance.stopCoroutine(coroutine);
    }

    public stopAllCoroutines(): void {
        Engine.Instance.stopAllCoroutines(this);
    }

    /** Remove this object from the engine. */
    destroy(): void {
        this.destroyed = true;
        this.stopAllCoroutines();
        Engine.Instance.removeObject(this);
    }
}

