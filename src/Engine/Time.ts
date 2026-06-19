/**
 * Time.ts
 *
 * Provides global frame time metrics, similar to Unity's Time class.
 */
export class Time {
    private static _deltaTime: number = 0;
    private static _deltaTimeMs: number = 0;
    private static _time: number = 0;

    /**
     * The interval in seconds from the last frame to the current one.
     */
    public static get deltaTime(): number {
        return this._deltaTime;
    }

    /**
     * The interval in milliseconds from the last frame to the current one.
     */
    public static get deltaTimeMs(): number {
        return this._deltaTimeMs;
    }

    /**
     * The total time in seconds since the game started.
     */
    public static get time(): number {
        return this._time;
    }

    /**
     * Internal framework method. Updates the static time values.
     * @param dtMs Time passed since last frame in milliseconds.
     */
    public static update(dtMs: number): void {
        this._deltaTimeMs = dtMs;
        this._deltaTime = dtMs / 1000;
        this._time += this._deltaTime;
    }
}

