/**
 * Time.ts
 *
 * Provides global frame time metrics, similar to Unity's Time class.
 */
export class Time {
    static _deltaTime = 0;
    static _deltaTimeMs = 0;
    static _time = 0;
    static _timeScale = 1;
    /**
     * The interval in seconds from the last frame to the current one,
     * already affected by timeScale.
     */
    static get deltaTime() {
        return this._deltaTime;
    }
    /**
     * The interval in milliseconds from the last frame to the current one,
     * already affected by timeScale.
     */
    static get deltaTimeMs() {
        return this._deltaTimeMs;
    }
    /**
     * The total time in seconds since the game started (respects timeScale).
     */
    static get time() {
        return this._time;
    }
    /**
     * The scale at which time passes. 1 is normal speed, 0 pauses the game
     * (deltaTime becomes 0, freezing movement, coroutines and fixedUpdate).
     */
    static get timeScale() {
        return this._timeScale;
    }
    static set timeScale(value) {
        this._timeScale = Math.max(0, value);
    }
    /**
     * Internal framework method. Updates the static time values.
     * @param dtMs Unscaled time passed since last frame in milliseconds.
     */
    static update(dtMs) {
        this._deltaTimeMs = dtMs * this._timeScale;
        this._deltaTime = this._deltaTimeMs / 1000;
        this._time += this._deltaTime;
    }
}
//# sourceMappingURL=Time.js.map