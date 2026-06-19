import {GameObject} from './Engine/GameObject.js';
import {input} from './Engine/InputManager.js';
import {Engine} from './Engine/Engine.js';
import {JuiceboxSpawner} from "./JuiceboxSpawner.js";
import {Time} from "./Engine/Time.js";

const SIZE: number = 50;
const ROTATION_LERP: number = 3;
const MIN_MOVE_DIST: number = 2;

const INITIAL_SPEED: number = 60;
const INITIAL_COLLECTION_RADIUS: number = 30;

/**
 * Beaver – player-controlled character that follows the mouse cursor.
 */
export class Beaver extends GameObject {
    public speed: number = INITIAL_SPEED;
    public collectionRadius: number = INITIAL_COLLECTION_RADIUS;

    private image!: HTMLImageElement;

    override start(): void {
        this.layer = 2;
        this.position.x = Engine.Instance.canvas.width / 2;
        this.position.y = Engine.Instance.canvas.height / 2;
        this.image = new Image();
        this.image.src = 'resources/beaver.png';
    }

    override update(): void {
        const mouseX: number = input.mouse.x;
        const mouseY: number = input.mouse.y;
        this.moveTowardsMouse(mouseX, mouseY);
        this.rotateTowardsMouse(mouseX, mouseY);
    }

    override fixedUpdate() {
        this.collectJuice();
    }

    /** @param {CanvasRenderingContext2D} ctx */
    override draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.drawImage(this.image, -SIZE/2, -SIZE/2, SIZE, SIZE);
        ctx.restore();
    }

    moveTowardsMouse(mouseX: number, mouseY: number): void {
        const dx: number = mouseX - this.position.x;
        const dy: number = mouseY - this.position.y;
        const dist: number = Math.hypot(dx, dy);
        const adjustedSpeed: number = this.speed * Time.deltaTime;

        if (dist > adjustedSpeed) {
            this.position.x += (dx / dist) * adjustedSpeed;
            this.position.y += (dy / dist) * adjustedSpeed;
        } else {
            this.position.x = mouseX;
            this.position.y = mouseY;
        }
    }

    rotateTowardsMouse(mouseX: number, mouseY: number): void {
        const adx: number = mouseX - this.position.x;
        const ady: number = mouseY - this.position.y;
        const targetAngle: number = Math.hypot(adx, ady) > MIN_MOVE_DIST
            ? Math.atan2(ady, adx) + Math.PI / 2
            : 0; // turn upright when standing still
        let da: number = targetAngle - this.rotation;
        while (da > Math.PI) da -= Math.PI * 2;
        while (da < -Math.PI) da += Math.PI * 2;
        this.rotation += da * ROTATION_LERP * Time.deltaTime;
    }

    collectJuice(): void {
        for (const jb of JuiceboxSpawner.activeJuiceboxes) {
            if (jb.collected) continue;

            const juiceboxDist: number = Math.hypot(
                jb.position.x - this.position.x,
                jb.position.y - this.position.y
            );

            if (juiceboxDist < this.collectionRadius) jb.startCollecting();
            else jb.stopCollecting();
        }
    }
}