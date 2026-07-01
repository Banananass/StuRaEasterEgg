import {GameObject} from './Engine/GameObject.js';

const PARTICLE_COUNT: number = 20;
const GRAVITY: number = 0.12;  // px / frame²
const FADE_SPEED: number = 0.022;
const RADIUS: number = 4;

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    color: string;
}

/**
 * ParticleSystem – one-shot burst of colored circles.
 * Destroys itself automatically when all particles have faded out.
 */
export class ParticleSystem extends GameObject {
    public particles: Particle[];
    private colorTheme: 'gold' | 'normal';

    constructor(x: number, y: number, colorTheme: 'gold' | 'normal' = 'normal') {
        super();
        this.position.x = x;
        this.position.y = y;
        this.particles = [];
        this.layer = 3;
        this.colorTheme = colorTheme;
    }

    override start(): void {
        for (let i: number = 0; i < PARTICLE_COUNT; i++) {
            const angle: number = Math.random() * Math.PI * 2;
            const speed: number = 1 + Math.random() * 4;

            const hue = this.colorTheme === 'gold'
                ? Math.random() * 15 + 42  // 42 to 57 is warm gold/yellow
                : Math.random() * 60 + 280; // 280 to 340 is purple/magenta

            this.particles.push({
                x: this.position.x,
                y: this.position.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color: `hsl(${hue}, 95%, 55%)`,
            });
        }
    }

    override update(): void {
        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += GRAVITY;
            p.alpha = Math.max(0, p.alpha - FADE_SPEED);
        }

        this.particles = this.particles.filter((p: Particle) => p.alpha > 0);

        if (this.particles.length === 0) {
            this.destroy();
        }
    }

    /** @param {CanvasRenderingContext2D} ctx */
    override draw(ctx: CanvasRenderingContext2D): void {
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

