import { Engine } from "./Engine.js";
import { Vector2 } from "./Vector2.js";
/**
 * GameObject – Base class for all game entities.
 */
export class GameObject {
    destroyed;
    enabled;
    position;
    rotation;
    scale;
    layer;
    get Destroyed() {
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
    awake() {
    }
    /** Called once before the first frame. */
    start() {
    }
    /** Called every rendered frame. */
    update() {
    }
    /** Called at a fixed 50 fps rate (every 20 ms). */
    fixedUpdate() {
    }
    /** Called every rendered frame after update(). */
    draw(ctx) {
    }
    /**
     * Start a coroutine bound to this GameObject.
     * The coroutine will automatically pause when this object is disabled,
     * and terminate when this object is destroyed.
     */
    startCoroutine(routine) {
        return Engine.Instance.startCoroutine(routine, this);
    }
    /**
     * Stop a coroutine.
     * @param coroutine The coroutine to stop.
     */
    stopCoroutine(coroutine) {
        Engine.Instance.stopCoroutine(coroutine);
    }
    /** Stop all coroutines bound to this GameObject. */
    stopAllCoroutines() {
        Engine.Instance.stopAllCoroutines(this);
    }
    /** Remove this object from the engine. */
    destroy() {
        this.destroyed = true;
        this.stopAllCoroutines();
        Engine.Instance.removeObject(this);
    }
}
//# sourceMappingURL=GameObject.js.map