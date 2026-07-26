/**
 * Time – provides global frame time metrics, similar to Unity's Time class.
 */
export class Time {
    private static _deltaTime: number = 0;
    private static _realDeltaTime: number = 0;
    private static _deltaTimeMs: number = 0;
    private static _realDeltaTimeMs: number = 0;
    private static _time: number = 0;
    private static _realTime: number = 0;
    private static _timeScale: number = 1;

    /** Seconds since the last frame. Affected by timeScale. */
    public static get deltaTime(): number {
        return this._deltaTime;
    }

    /** Seconds since the last frame. Not affected by timeScale. */
    public static get realDeltaTime(): number {
        return this._realDeltaTime;
    }

    /** Milliseconds since the last frame. Affected by timeScale. */
    public static get deltaTimeMs(): number {
        return this._deltaTimeMs;
    }

    /** Milliseconds since the last frame. Not affected by timeScale. */
    public static get realDeltaTimeMs(): number {
        return this._realDeltaTimeMs;
    }

    /** Total seconds since the game started. Affected by timeScale. */
    public static get time(): number {
        return this._time;
    }

    /** Total seconds since the game started. Not affected by timeScale. */
    public static get realTime(): number {
        return this._realTime;
    }

    /** The scale at which time passes. 1 is normal speed. */
    public static get timeScale(): number {
        return this._timeScale;
    }

    public static set timeScale(value: number) {
        this._timeScale = Math.max(0, value);
    }

    /** Internal framework method. Updates the static time values. */
    public static update(dtMs: number): void {
        this._deltaTimeMs = dtMs * this._timeScale;
        this._deltaTime = this._deltaTimeMs / 1000;
        this._time += this._deltaTime;

        this._realDeltaTimeMs = dtMs;
        this._realDeltaTime = this._realDeltaTimeMs / 1000;
        this._realTime += this._realDeltaTime;
    }
}

