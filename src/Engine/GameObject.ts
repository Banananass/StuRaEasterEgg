import {Engine} from "./Engine.js";
import {Vector2} from "./Vector2.js";

/**
 * GameObject – Base class for all game entities.
 */
export abstract class GameObject {
    private readonly engine: Engine;
    private destroyed: boolean;
    public enabled: boolean;

    public position: Vector2;
    public rotation: number;
    public scale: Vector2;
    public layer: number;

    get Destroyed(): boolean {
        return this.destroyed;
    }

    get Engine(): Engine {
        return this.engine;
    }

    constructor(engine: Engine) {
        this.engine = engine;
        this.destroyed = false;
        this.enabled = true;
        this.position = new Vector2(0, 0);
        this.rotation = 0;
        this.scale = new Vector2(1, 1);
        this.layer = 0;
        this.awake();
        this.engine.addObject(this);
    }

    /** Called on object creation. */
    awake(): void {
    }

    /** Called once before the first frame. */
    start(): void {
    }

    /**
     * Called every rendered frame.
     * @param dt – elapsed milliseconds since the last frame
     */
    update(dt: number): void {
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

    /** Remove this object from the engine. */
    destroy(): void {
        this.destroyed = true;
        this.engine.removeObject(this);
    }
}

