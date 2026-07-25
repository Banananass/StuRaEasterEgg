/**
 * Time.ts
 *
 * Provides global frame time metrics, similar to Unity's Time class.
 */
export class Time {
    private static _deltaTime: number = 0;
    private static _deltaTimeMs: number = 0;
    private static _time: number = 0;
    private static _timeScale: number = 1;

    /**
     * The interval in seconds from the last frame to the current one,
     * already affected by timeScale.
     */
    public static get deltaTime(): number {
        return this._deltaTime;
    }

    /**
     * The interval in milliseconds from the last frame to the current one,
     * already affected by timeScale.
     */
    public static get deltaTimeMs(): number {
        return this._deltaTimeMs;
    }

    /**
     * The total time in seconds since the game started (respects timeScale).
     */
    public static get time(): number {
        return this._time;
    }

    /**
     * The scale at which time passes. 1 is normal speed, 0 pauses the game
     * (deltaTime becomes 0, freezing movement, coroutines and fixedUpdate).
     */
    public static get timeScale(): number {
        return this._timeScale;
    }

    public static set timeScale(value: number) {
        this._timeScale = Math.max(0, value);
    }

    /**
     * Internal framework method. Updates the static time values.
     * @param dtMs Unscaled time passed since last frame in milliseconds.
     */
    public static update(dtMs: number): void {
        this._deltaTimeMs = dtMs * this._timeScale;
        this._deltaTime = this._deltaTimeMs / 1000;
        this._time += this._deltaTime;
    }
}

