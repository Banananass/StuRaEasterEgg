/**
 * Vector2.ts
 *
 * Simple 2D vector class for positions, velocities, etc.
 */
export class Vector2 {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}