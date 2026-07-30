import {GameObject} from './Engine/GameObject.js';
import {Engine} from './Engine/Engine.js';
import {Juicebox} from './Juicebox.js';

const INITIAL_SPAWN_INTERVAL_MIN: number = 3000;
const INITIAL_SPAWN_INTERVAL_MAX: number = 7000;

/**
 * JuiceboxSpawner – script responsible for scheduling and spawning Juiceboxes.
 */
export class JuiceboxSpawner extends GameObject {
    public static Instance: JuiceboxSpawner | null = null;
    private spawnTimeout: ReturnType<typeof setTimeout> | null = null;

    public get SpawnIntervalMin(): number {
        return INITIAL_SPAWN_INTERVAL_MIN;
    }

    public get SpawnIntervalMax(): number {
        return INITIAL_SPAWN_INTERVAL_MAX;
    }

    public get maxActive(): number {
        return 1;
    }

    public static readonly activeJuiceboxes: Set<Juicebox> = new Set<Juicebox>();

    override start(): void {
        JuiceboxSpawner.Instance = this;
        this.checkAndSpawn();
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

    /** Clears active juiceboxes and pending spawns, then re-schedules based on current upgrade levels. */
    public static resetState(): void {
        const instance = JuiceboxSpawner.Instance;
        if (!instance) return;

        if (instance.spawnTimeout) {
            clearTimeout(instance.spawnTimeout);
            instance.spawnTimeout = null;
        }

        for (const jb of JuiceboxSpawner.activeJuiceboxes) {
            Engine.Instance.removeObject(jb);
        }
        JuiceboxSpawner.activeJuiceboxes.clear();

        instance.checkAndSpawn();
    }
}

