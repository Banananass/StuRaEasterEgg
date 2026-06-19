import { GameObject } from './Engine/GameObject.js';
import { Juicebox } from './Juicebox.js';
const INITIAL_SPAWN_INTERVAL_MIN = 3000;
const INITIAL_SPAWN_INTERVAL_MAX = 7000;
/**
 * JuiceboxSpawner – script responsible for scheduling and spawning Juiceboxes.
 */
export class JuiceboxSpawner extends GameObject {
    spawnTimeout = null;
    spawnIntervalMin = INITIAL_SPAWN_INTERVAL_MIN;
    spawnIntervalMax = INITIAL_SPAWN_INTERVAL_MAX;
    static activeJuiceboxes = new Set();
    start() {
        this.spawnImmediate();
    }
    spawnImmediate() {
        JuiceboxSpawner.activeJuiceboxes.add(new Juicebox(this));
    }
    onJuiceboxDestroyed(jb) {
        JuiceboxSpawner.activeJuiceboxes.delete(jb);
        this.scheduleSpawn();
    }
    scheduleSpawn() {
        if (this.spawnTimeout)
            return;
        const delay = this.spawnIntervalMin +
            Math.random() * (this.spawnIntervalMax - this.spawnIntervalMin);
        this.spawnTimeout = setTimeout(() => {
            this.spawnTimeout = null;
            this.spawnImmediate();
        }, delay);
    }
    destroy() {
        if (this.spawnTimeout) {
            clearTimeout(this.spawnTimeout);
        }
        super.destroy();
    }
}
//# sourceMappingURL=JuiceboxSpawner.js.map