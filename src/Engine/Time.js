/**
 * Time.ts
 *
 * Provides global frame time metrics, similar to Unity's Time class.
 */
export class Time {
    static _deltaTime = 0;
    static _deltaTimeMs = 0;
    static _time = 0;
    /**
     * The interval in seconds from the last frame to the current one.
     */
    static get deltaTime() {
        return this._deltaTime;
    }
    /**
     * The interval in milliseconds from the last frame to the current one.
     */
    static get deltaTimeMs() {
        return this._deltaTimeMs;
    }
    /**
     * The total time in seconds since the game started.
     */
    static get time() {
        return this._time;
    }
    /**
     * Internal framework method. Updates the static time values.
     * @param dtMs Time passed since last frame in milliseconds.
     */
    static update(dtMs) {
        this._deltaTimeMs = dtMs;
        this._deltaTime = dtMs / 1000;
        this._time += this._deltaTime;
    }
}
//# sourceMappingURL=Time.js.map