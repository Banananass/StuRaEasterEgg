/**
 * ScoreManager – Tracks the player score and updates the DOM.
 * Plain class, not a GameObject (no update/draw logic needed).
 */
export class ScoreManager {
    _score;
    _scoreEl;
    _boardEl;
    static instance;
    constructor() {
        this._score = 0;
        this._scoreEl = document.getElementById('score');
        this._boardEl = document.getElementById('score-board');
    }
    get score() {
        return this._score;
    }
    static get Instance() {
        return this.instance || (this.instance = new this());
    }
    /**
     * Increase the score by `amount` and refresh the DOM.
     * @param {number} amount
     */
    addScore(amount = 1) {
        this.setScore(this._score + amount);
    }
    /**
     * Directly sets the score, refreshing the DOM.
     * @param value The new score value.
     */
    setScore(value) {
        this._score = value;
        if (this._scoreEl) {
            this._scoreEl.textContent = String(this._score);
        }
        if (this._boardEl && this._score > 0) {
            this._boardEl.style.display = 'block'; // reveal on first collect
        }
    }
    /** Resets the score back to zero. */
    resetScore() {
        this.setScore(0);
        if (this._boardEl)
            this._boardEl.style.display = 'none';
    }
}
//# sourceMappingURL=ScoreManager.js.map