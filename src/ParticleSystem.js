import { GameObject } from './Engine/GameObject.js';
const PARTICLE_COUNT = 20;
const GRAVITY = 0.12; // px / frame²
const FADE_SPEED = 0.022;
const RADIUS = 4;
/**
 * ParticleSystem – one-shot burst of coloured circles.
 * Destroys itself automatically when all particles have faded out.
 */
export class ParticleSystem extends GameObject {
    particles;
    constructor(engine, x, y) {
        super(engine);
        this.position.x = x;
        this.position.y = y;
        this.particles = [];
        this.layer = 3;
    }
    start() {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 4;
            this.particles.push({
                x: this.position.x,
                y: this.position.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color: `hsl(${Math.random() * 60 + 280}, 90%, 60%)`,
            });
        }
    }
    update(dt) {
        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += GRAVITY;
            p.alpha = Math.max(0, p.alpha - FADE_SPEED);
        }
        this.particles = this.particles.filter((p) => p.alpha > 0);
        if (this.particles.length === 0) {
            this.destroy();
        }
    }
    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}
//# sourceMappingURL=ParticleSystem.js.map