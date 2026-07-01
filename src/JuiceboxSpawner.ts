import {GameObject} from './Engine/GameObject.js';
import {Juicebox} from './Juicebox.js';
import {UpgradeShop} from './UpgradeShop.js';

const INITIAL_SPAWN_INTERVAL_MIN: number = 3000;
const INITIAL_SPAWN_INTERVAL_MAX: number = 7000;

/**
 * JuiceboxSpawner – script responsible for scheduling and spawning Juiceboxes.
 */
export class JuiceboxSpawner extends GameObject {
    public static Instance: JuiceboxSpawner | null = null;
    private spawnTimeout: ReturnType<typeof setTimeout> | null = null;

    public get SpawnIntervalMin(): number {
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

    public get SpawnIntervalMax(): number {
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

    public static readonly activeJuiceboxes: Set<Juicebox> = new Set<Juicebox>();

    override start(): void {
        JuiceboxSpawner.Instance = this;
        this.checkAndSpawn();
    }

    public get maxActive(): number {
        const lvl = UpgradeShop.getUpgradeLevel('spawner');
        return lvl >= 3 ? 2 : 1;
    }

    public checkAndSpawn(): void {
        const target = this.maxActive;
        while (JuiceboxSpawner.activeJuiceboxes.size < target) {
            this.spawnImmediate();
        }
    }

    public spawnImmediate(): void {
        JuiceboxSpawner.activeJuiceboxes.add(new Juicebox(this));
        this.checkAndScheduleMore();
    }

    private checkAndScheduleMore(): void {
        if (JuiceboxSpawner.activeJuiceboxes.size < this.maxActive) {
            this.scheduleSpawn();
        }
    }

    public onJuiceboxDestroyed(jb: Juicebox): void {
        JuiceboxSpawner.activeJuiceboxes.delete(jb);
        this.scheduleSpawn();
    }

    private scheduleSpawn(): void {
        if (this.spawnTimeout) return;

        const delay: number = this.SpawnIntervalMin + Math.random() * (this.SpawnIntervalMax - this.SpawnIntervalMin);
        this.spawnTimeout = setTimeout(() => {
            this.spawnTimeout = null;
            this.spawnImmediate();
        }, delay);
    }

    override destroy(): void {
        if (this.spawnTimeout) clearTimeout(this.spawnTimeout);
        super.destroy();
    }
}

