/**
 * Time – provides global frame time metrics, similar to Unity's Time class.
 */
export class Time {
    static _deltaTime = 0;
    static _realDeltaTime = 0;
    static _deltaTimeMs = 0;
    static _realDeltaTimeMs = 0;
    static _time = 0;
    static _realTime = 0;
    static _timeScale = 1;
    /** Seconds since the last frame. Affected by timeScale. */
    static get deltaTime() {
        return this._deltaTime;
    }
    /** Seconds since the last frame. Not affected by timeScale. */
    static get realDeltaTime() {
        return this._realDeltaTime;
    }
    /** Milliseconds since the last frame. Affected by timeScale. */
    static get deltaTimeMs() {
        return this._deltaTimeMs;
    }
    /** Milliseconds since the last frame. Not affected by timeScale. */
    static get realDeltaTimeMs() {
        return this._realDeltaTimeMs;
    }
    /** Total seconds since the game started. Affected by timeScale. */
    static get time() {
        return this._time;
    }
    /** Total seconds since the game started. Not affected by timeScale. */
    static get realTime() {
        return this._realTime;
    }
    /** The scale at which time passes. 1 is normal speed. */
    static get timeScale() {
        return this._timeScale;
    }
    static set timeScale(value) {
        this._timeScale = Math.max(0, value);
    }
    /** Internal framework method. Updates the static time values. */
    static update(dtMs) {
        this._deltaTimeMs = dtMs * this._timeScale;
        this._deltaTime = this._deltaTimeMs / 1000;
        this._time += this._deltaTime;
        this._realDeltaTimeMs = dtMs;
        this._realDeltaTime = this._realDeltaTimeMs / 1000;
        this._realTime += this._realDeltaTime;
    }
}
//# sourceMappingURL=Time.js.map