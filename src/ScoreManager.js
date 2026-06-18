/**
 * ScoreManager – Tracks the player score and updates the DOM.
 * Plain class, not a GameObject (no update/draw logic needed).
 */
export class ScoreManager {
    _score;
    _scoreEl;
    _boardEl;
    constructor() {
        this._score = 0;
        this._scoreEl = document.getElementById('score');
        this._boardEl = document.getElementById('score-board');
    }
    get score() {
        return this._score;
    }
    /**
     * Increase the score by `amount` and refresh the DOM.
     * @param {number} amount
     */
    addScore(amount = 1) {
        this._score += amount;
        if (this._scoreEl) {
            this._scoreEl.textContent = String(this._score);
        }
        if (this._boardEl) {
            this._boardEl.style.display = 'block'; // reveal on first collect
        }
    }
}
//# sourceMappingURL=ScoreManager.js.map