/**
 * ScoreManager – Tracks the player score and updates the DOM.
 * Plain class, not a GameObject (no update/draw logic needed).
 */
export class ScoreManager {
    private _score: number;
    private readonly _scoreEl: HTMLElement;
    private readonly _boardEl: HTMLElement;

    private static instance: ScoreManager;

    private constructor() {
        this._score = 0;
        this._scoreEl = document.getElementById('score') as HTMLElement;
        this._boardEl = document.getElementById('score-board') as HTMLElement;
    }

    public get score(): number {
        return this._score;
    }

    public static get Instance(): ScoreManager{
        return this.instance || (this.instance = new this());
    }

    /**
     * Increase the score by `amount` and refresh the DOM.
     * @param {number} amount
     */
    addScore(amount: number = 1): void {
        this.setScore(this._score + amount);
    }

    /**
     * Directly sets the score, refreshing the DOM.
     * @param value The new score value.
     */
    setScore(value: number): void {
        this._score = value;
        if (this._scoreEl) {
            this._scoreEl.textContent = String(this._score);
        }
        if (this._boardEl && this._score > 0) {
            this._boardEl.style.display = 'block'; // reveal on first collect
        }
    }

    /** Resets the score back to zero. */
    resetScore(): void {
        this.setScore(0);
        if (this._boardEl) this._boardEl.style.display = 'none';
    }
}

