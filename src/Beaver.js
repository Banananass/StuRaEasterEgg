import { GameObject } from './Engine/GameObject.js';
import { input } from './Engine/InputManager.js';
import { Engine } from './Engine/Engine.js';
import { JuiceboxSpawner } from "./JuiceboxSpawner.js";
import { Time } from "./Engine/Time.js";
const SIZE = 50;
const ROTATION_LERP = 3;
const MIN_MOVE_DIST = 2;
const INITIAL_SPEED = 60;
const INITIAL_COLLECTION_RADIUS = 30;
/**
 * Beaver – player-controlled character that follows the mouse cursor.
 */
export class Beaver extends GameObject {
    speed = INITIAL_SPEED;
    collectionRadius = INITIAL_COLLECTION_RADIUS;
    image;
    start() {
        this.layer = 2;
        this.position.x = Engine.Instance.canvas.width / 2;
        this.position.y = Engine.Instance.canvas.height / 2;
        this.image = new Image();
        this.image.src = 'resources/beaver.png';
    }
    update() {
        const mouseX = input.mouse.x;
        const mouseY = input.mouse.y;
        this.moveTowardsMouse(mouseX, mouseY);
        this.rotateTowardsMouse(mouseX, mouseY);
    }
    fixedUpdate() {
        this.collectJuice();
    }
    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.drawImage(this.image, -SIZE / 2, -SIZE / 2, SIZE, SIZE);
        ctx.restore();
    }
    moveTowardsMouse(mouseX, mouseY) {
        const dx = mouseX - this.position.x;
        const dy = mouseY - this.position.y;
        const dist = Math.hypot(dx, dy);
        const adjustedSpeed = this.speed * Time.deltaTime;
        if (dist > adjustedSpeed) {
            this.position.x += (dx / dist) * adjustedSpeed;
            this.position.y += (dy / dist) * adjustedSpeed;
        }
        else {
            this.position.x = mouseX;
            this.position.y = mouseY;
        }
    }
    rotateTowardsMouse(mouseX, mouseY) {
        const adx = mouseX - this.position.x;
        const ady = mouseY - this.position.y;
        const targetAngle = Math.hypot(adx, ady) > MIN_MOVE_DIST
            ? Math.atan2(ady, adx) + Math.PI / 2
            : 0; // turn upright when standing still
        let da = targetAngle - this.rotation;
        while (da > Math.PI)
            da -= Math.PI * 2;
        while (da < -Math.PI)
            da += Math.PI * 2;
        this.rotation += da * ROTATION_LERP * Time.deltaTime;
    }
    collectJuice() {
        for (const jb of JuiceboxSpawner.activeJuiceboxes) {
            if (jb.collected)
                continue;
            const juiceboxDist = Math.hypot(jb.position.x - this.position.x, jb.position.y - this.position.y);
            if (juiceboxDist < this.collectionRadius)
                jb.startCollecting();
            else
                jb.stopCollecting();
        }
    }
}
//# sourceMappingURL=Beaver.js.map