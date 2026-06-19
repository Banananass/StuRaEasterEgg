import {GameObject} from './Engine/GameObject.js';
import {Juicebox} from './Juicebox.js';

const INITIAL_SPAWN_INTERVAL_MIN: number = 3000;
const INITIAL_SPAWN_INTERVAL_MAX: number = 7000;

/**
 * JuiceboxSpawner – script responsible for scheduling and spawning Juiceboxes.
 */
export class JuiceboxSpawner extends GameObject {
    private spawnTimeout: ReturnType<typeof setTimeout> | null = null;

    public spawnIntervalMin: number = INITIAL_SPAWN_INTERVAL_MIN;
    public spawnIntervalMax: number = INITIAL_SPAWN_INTERVAL_MAX;

    public static readonly activeJuiceboxes: Set<Juicebox> = new Set<Juicebox>();

    override start(): void {
        this.spawnImmediate();
    }

    public spawnImmediate(): void {
        JuiceboxSpawner.activeJuiceboxes.add(new Juicebox(this));
    }

    public onJuiceboxDestroyed(jb: Juicebox): void {
        JuiceboxSpawner.activeJuiceboxes.delete(jb);
        this.scheduleSpawn();
    }

    private scheduleSpawn(): void {
        if (this.spawnTimeout) return;
        const delay: number = this.spawnIntervalMin +
            Math.random() * (this.spawnIntervalMax - this.spawnIntervalMin);
        this.spawnTimeout = setTimeout(() => {
            this.spawnTimeout = null;
            this.spawnImmediate();
        }, delay);
    }

    override destroy(): void {
        if (this.spawnTimeout) {
            clearTimeout(this.spawnTimeout);
        }
        super.destroy();
    }
}

