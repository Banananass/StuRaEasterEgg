/**
 * Coroutine.ts
 *
 * Implements Unity-like Coroutine behavior using JavaScript Generators.
 */

export interface YieldInstruction {
    /**
     * Checks if the condition to continue is met.
     * @param dt Elapsed time in milliseconds since the last frame.
     * @returns True if the wait is over and the coroutine can continue.
     */
    isDone(dt: number): boolean;
}

/**
 * Waited for a specified amount of seconds.
 */
export class WaitForSeconds implements YieldInstruction {
    private remainingSeconds: number;

    constructor(seconds: number) {
        this.remainingSeconds = seconds;
    }

    isDone(dt: number): boolean {
        this.remainingSeconds -= dt / 1000;
        return this.remainingSeconds <= 0;
    }
}

/**
 * Waits until the given predicate returns true.
 */
export class WaitUntil implements YieldInstruction {
    private predicate: () => boolean;

    constructor(predicate: () => boolean) {
        this.predicate = predicate;
    }

    isDone(dt: number): boolean {
        return this.predicate();
    }
}

/**
 * Waits as long as the given predicate returns true.
 */
export class WaitWhile implements YieldInstruction {
    private predicate: () => boolean;

    constructor(predicate: () => boolean) {
        this.predicate = predicate;
    }

    isDone(dt: number): boolean {
        return !this.predicate();
    }
}

/**
 * Represents a running Coroutine.
 */
export class Coroutine implements YieldInstruction {
    private routine: Generator<any, any, any>;
    private currentInstruction: YieldInstruction | null = null;
    private isFinished: boolean = false;

    constructor(routine: Generator<any, any, any>) {
        this.routine = routine;
    }

    isDone(dt: number): boolean {
        return this.isFinished;
    }

    /**
     * Updates the coroutine state.
     * @param dt Elapsed time in milliseconds.
     * @returns True if the coroutine is still running, false if it has finished.
     */
    update(dt: number): boolean {
        if (this.isFinished) return false;

        // If we are currently waiting on an instruction
        if (this.currentInstruction) {
            if (this.currentInstruction instanceof Coroutine) {
                // Nested coroutines updated recursively
                const running = this.currentInstruction.update(dt);
                if (running) {
                    return true;
                }
            } else {
                if (!this.currentInstruction.isDone(dt)) {
                    return true;
                }
            }
            this.currentInstruction = null;
        }

        // Advance the generator
        try {
            const result = this.routine.next();
            if (result.done) {
                this.isFinished = true;
                return false;
            }

            const value = result.value;

            if (value && typeof value.isDone === 'function') {
                this.currentInstruction = value;
            } else if (value instanceof Promise) {
                let promiseDone = false;
                value.then(() => promiseDone = true).catch(() => promiseDone = true);
                this.currentInstruction = {
                    isDone: () => promiseDone
                };
            } else if (value && typeof value[Symbol.iterator] === 'function') {
                // If another generator was yielded directly
                this.currentInstruction = new Coroutine(value);
            } else {
                // null, undefined, numeric values, etc. represent yielding for 1 frame
                this.currentInstruction = null;
            }
        } catch (e) {
            console.error("Error in coroutine execution:", e);
            this.isFinished = true;
            return false;
        }

        return true;
    }

    /**
     * Terminate the coroutine execution prematurely.
     */
    stop(): void {
        this.isFinished = true;
    }
}

