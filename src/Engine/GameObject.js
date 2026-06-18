import { Vector2 } from "./Vector2.js";
/**
 * GameObject – Base class for all game entities.
 */
export class GameObject {
    engine;
    destroyed;
    enabled;
    position;
    rotation;
    scale;
    layer;
    get Destroyed() {
        return this.destroyed;
    }
    get Engine() {
        return this.engine;
    }
    constructor(engine) {
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
    awake() {
    }
    /** Called once before the first frame. */
    start() {
    }
    /**
     * Called every rendered frame.
     * @param dt – elapsed milliseconds since the last frame
     */
    update(dt) {
    }
    /** Called at a fixed 50 fps rate (every 20 ms). */
    fixedUpdate() {
    }
    /**
     * Called every rendered frame after update().
     * @param ctx
     */
    draw(ctx) {
    }
    /** Remove this object from the engine. */
    destroy() {
        this.destroyed = true;
        this.engine.removeObject(this);
    }
}
//# sourceMappingURL=GameObject.js.map