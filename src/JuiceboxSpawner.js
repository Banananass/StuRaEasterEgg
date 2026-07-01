import { GameObject } from './Engine/GameObject.js';
import { Juicebox } from './Juicebox.js';
import { UpgradeShop } from './UpgradeShop.js';
const INITIAL_SPAWN_INTERVAL_MIN = 3000;
const INITIAL_SPAWN_INTERVAL_MAX = 7000;
/**
 * JuiceboxSpawner – script responsible for scheduling and spawning Juiceboxes.
 */
export class JuiceboxSpawner extends GameObject {
    static Instance = null;
    spawnTimeout = null;
    get SpawnIntervalMin() {
        switch (UpgradeShop.getUpgradeLevel('spawner')) {
            case 0:
                return INITIAL_SPAWN_INTERVAL_MIN;
            case 1:
                return INITIAL_SPAWN_INTERVAL_MIN * 0.9;
            case 2:
                return INITIAL_SPAWN_INTERVAL_MIN * 0.8;
            case 3:
                return INITIAL_SPAWN_INTERVAL_MIN * 0.7;
            default:
                return INITIAL_SPAWN_INTERVAL_MIN;
        }
    }
    get SpawnIntervalMax() {
        switch (UpgradeShop.getUpgradeLevel('spawner')) {
            case 0:
                return INITIAL_SPAWN_INTERVAL_MAX;
            case 1:
                return INITIAL_SPAWN_INTERVAL_MAX * 0.9;
            case 2:
                return INITIAL_SPAWN_INTERVAL_MAX * 0.8;
            case 3:
                return INITIAL_SPAWN_INTERVAL_MAX * 0.7;
            default:
                return INITIAL_SPAWN_INTERVAL_MAX;
        }
    }
    static activeJuiceboxes = new Set();
    start() {
        JuiceboxSpawner.Instance = this;
        this.checkAndSpawn();
    }
    get maxActive() {
        const lvl = UpgradeShop.getUpgradeLevel('spawner');
        return lvl >= 3 ? 2 : 1;
    }
    checkAndSpawn() {
        const target = this.maxActive;
        while (JuiceboxSpawner.activeJuiceboxes.size < target) {
            this.spawnImmediate();
        }
    }
    spawnImmediate() {
        JuiceboxSpawner.activeJuiceboxes.add(new Juicebox(this));
        this.checkAndScheduleMore();
    }
    checkAndScheduleMore() {
        if (JuiceboxSpawner.activeJuiceboxes.size < this.maxActive) {
            this.scheduleSpawn();
        }
    }
    onJuiceboxDestroyed(jb) {
        JuiceboxSpawner.activeJuiceboxes.delete(jb);
        this.scheduleSpawn();
    }
    scheduleSpawn() {
        if (this.spawnTimeout)
            return;
        const delay = this.SpawnIntervalMin + Math.random() * (this.SpawnIntervalMax - this.SpawnIntervalMin);
        this.spawnTimeout = setTimeout(() => {
            this.spawnTimeout = null;
            this.spawnImmediate();
        }, delay);
    }
    destroy() {
        if (this.spawnTimeout)
            clearTimeout(this.spawnTimeout);
        super.destroy();
    }
}
//# sourceMappingURL=JuiceboxSpawner.js.map