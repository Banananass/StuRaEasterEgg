/**
 * ScoreManager – Tracks the player score and updates the DOM.
 * Plain class, not a GameObject (no update/draw logic needed).
 */
export class ScoreManager {
    private _score: number;
    private readonly _scoreEl: HTMLElement;
    private readonly _boardEl: HTMLElement;

    constructor() {
        this._score = 0;
        this._scoreEl = document.getElementById('score') as HTMLElement;
        this._boardEl = document.getElementById('score-board') as HTMLElement;
    }

    get score(): number {
        return this._score;
    }

    /**
     * Increase the score by `amount` and refresh the DOM.
     * @param {number} amount
     */
    addScore(amount: number = 1): void {
        this._score += amount;
        if (this._scoreEl) {
            this._scoreEl.textContent = String(this._score);
        }
        if (this._boardEl) {
            this._boardEl.style.display = 'block'; // reveal on first collect
        }
    }
}

