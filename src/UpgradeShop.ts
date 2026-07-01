import {GameObject} from './Engine/GameObject.js';
import {ScoreManager} from './ScoreManager.js';
import {Upgrade, INITIAL_UPGRADES} from './UpgradeData.js';

//TODO: Untangle

export class UpgradeShop extends GameObject {
    public static Instance: UpgradeShop | null = null;
    public static isOpen: boolean = false;

    private static levels: Record<string, number> = {};

    public static onUpgradePurchased: ((id: string, level: number) => void)[] = [];

    private buttonUnlocked: boolean = false;

    // DOM Elements
    private shopButton!: HTMLButtonElement;
    private shopOverlay!: HTMLDivElement;
    private shopContent!: HTMLDivElement;

    // Zoom and Pan States
    private zoomScale: number = 1.0;
    private panX: number = 0;
    private panY: number = 0;
    private isDragging: boolean = false;
    private dragStartX: number = 0;
    private dragStartY: number = 0;

    private upgrades: Upgrade[] = [];

    constructor() {
        super();
        UpgradeShop.Instance = this;
        // Deep copy the initial upgrade configurations
        this.upgrades = JSON.parse(JSON.stringify(INITIAL_UPGRADES));
        this.upgrades.forEach(u => {
            if (UpgradeShop.levels[u.id] === undefined) {
                UpgradeShop.levels[u.id] = u.level;
            }
        });
    }

    public static getUpgradeLevel(id: string): number {
        return this.levels[id] || 0;
    }

    override start(): void {
        this.initDOM();
    }

    override update(): void {
        // Show button after 3 points are gathered
        if (!this.buttonUnlocked && ScoreManager.Instance.score >= 3) {
            this.buttonUnlocked = true;
            if (this.shopButton) {
                this.shopButton.classList.add('visible');
            }
        }
    }

    private initDOM(): void {
        // Fetch pre-existing upgrade shop button from DOM
        const btn = document.getElementById('upgrade-shop-btn');
        if (btn) {
            this.shopButton = btn as HTMLButtonElement;
            this.shopButton.addEventListener('click', () => this.openShop());
        }

        // Fetch pre-existing upgrade shop overlay from DOM
        const overlay = document.getElementById('upgrade-shop-overlay');
        if (overlay) {
            this.shopOverlay = overlay as HTMLDivElement;

            // Hook close button within the pre-constructed HTML
            const closeBtn = this.shopOverlay.querySelector('.shop-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeShop());
            }
        }

        // Fetch scalable contents wrapper
        const content = document.getElementById('upgrade-shop-content');
        if (content) {
            this.shopContent = content as HTMLDivElement;
        }

        this.setupZoomAndPan();
        this.updateHTML();
    }

    private setupZoomAndPan(): void {
        const graphViewport = document.getElementById('upgrade-shop-graph');
        if (!graphViewport || !this.shopContent) return;

        const MIN_ZOOM = 0.5;
        const MAX_ZOOM = 3.0;

        // Reset transforms
        this.zoomScale = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.applyTransform();

        // 1. Mouse wheel zoom focusing on mouse coordinates
        graphViewport.addEventListener('wheel', (e: WheelEvent) => {
            e.preventDefault();
            const zoomSpeed = 0.08;
            const rect = graphViewport.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const oldScale = this.zoomScale;
            if (e.deltaY < 0) {
                this.zoomScale = Math.min(MAX_ZOOM, this.zoomScale + zoomSpeed);
            } else {
                this.zoomScale = Math.max(MIN_ZOOM, this.zoomScale - zoomSpeed);
            }

            // Pivot panning relative to cursor
            this.panX = mouseX - (mouseX - this.panX) * (this.zoomScale / oldScale);
            this.panY = mouseY - (mouseY - this.panY) * (this.zoomScale / oldScale);

            this.applyTransform();
        }, { passive: false });

        // 2. Mouse drag panning
        graphViewport.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.button !== 0 && e.button !== 1) return;
            this.isDragging = true;
            this.dragStartX = e.clientX - this.panX;
            this.dragStartY = e.clientY - this.panY;
        });

        window.addEventListener('mousemove', (e: MouseEvent) => {
            if (!this.isDragging || !this.shopOverlay || this.shopOverlay.style.display === 'none') return;
            this.panX = e.clientX - this.dragStartX;
            this.panY = e.clientY - this.dragStartY;
            this.applyTransform();
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        graphViewport.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });
    }

    private applyTransform(): void {
        if (this.shopContent) {
            this.shopContent.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomScale})`;
        }
    }

    private openShop(): void {
        UpgradeShop.isOpen = true;
        if (this.shopOverlay) {
            this.shopOverlay.style.display = 'flex';
        }

        // Reset transform to default when opening the shop for consistency
        this.zoomScale = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.applyTransform();

        this.updateHTML();
    }

    private closeShop(): void {
        UpgradeShop.isOpen = false;
        if (this.shopOverlay) {
            this.shopOverlay.style.display = 'none';
        }
    }

    private updateHTML(): void {
        // Update points
        const pointsVal = document.getElementById('shop-points-val');
        if (pointsVal) {
            pointsVal.textContent = String(ScoreManager.Instance.score);
        }

        const nodesContainer = document.getElementById('upgrade-shop-nodes');
        const svgContainer = document.getElementById('upgrade-shop-svg');
        if (!nodesContainer || !svgContainer) return;

        nodesContainer.innerHTML = '';
        svgContainer.innerHTML = '';

        // Draw connections and render cards
        this.upgrades.forEach(upgrade => {
            const state = this.getUpgradeState(upgrade);

            if (state === 'hidden') return;

            // Render node
            const nodeEl = document.createElement('div');
            nodeEl.className = `upgrade-node ${state}`;
            nodeEl.style.left = `${upgrade.x}%`;
            nodeEl.style.top = `${upgrade.y}%`;

            if (state === 'teased') {
                const dep = upgrade.dependency!;
                const depUpgrade = this.upgrades.find(u => u.id === dep.upgradeId)!;
                nodeEl.innerHTML = `
                    <div class="node-icon">🔒</div>
                    <div class="node-title">???</div>
                    <div class="node-desc teaser">Erfordert ${depUpgrade.name} auf Stufe ${dep.minLevel} zum Freischalten.</div>
                `;
            } else {
                const isMax = upgrade.level >= upgrade.levelCap;
                const price = isMax ? 0 : upgrade.prices[upgrade.level];
                const canAfford = ScoreManager.Instance.score >= price;
                const depMet = this.isDependencyMet(upgrade);
                const showBuyButton = !isMax;

                nodeEl.innerHTML = `
                    <div class="node-title">${upgrade.name}</div>
                    <div class="node-desc">${upgrade.description}</div>
                    <div class="node-level">Stufe: ${upgrade.level} / ${upgrade.levelCap}</div>
                    ${showBuyButton ? `
                        <button class="node-buy-btn" ${(!canAfford || !depMet) ? 'disabled' : ''}>
                            Kaufen (${price} 🧃)
                        </button>
                    ` : `
                        <div class="node-max">MAXIMALE STUFE</div>
                    `}
                `;

                if (showBuyButton) {
                    const buyBtn = nodeEl.querySelector('.node-buy-btn');
                    if (buyBtn && canAfford && depMet) {
                        buyBtn.addEventListener('click', () => this.buyUpgrade(upgrade));
                    }
                }
            }

            nodesContainer.appendChild(nodeEl);

            // Draw link from dependency to this node if dependency exists
            if (upgrade.dependency) {
                const depUpgrade = this.upgrades.find(u => u.id === upgrade.dependency!.upgradeId)!;
                const depState = this.getUpgradeState(depUpgrade);

                if (depState !== 'hidden') {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', String(depUpgrade.x));
                    line.setAttribute('y1', String(depUpgrade.y));
                    line.setAttribute('x2', String(upgrade.x));
                    line.setAttribute('y2', String(upgrade.y));

                    // Style the line based on target node state
                    if (state === 'revealed') {
                        line.setAttribute('class', 'connection-line revealed');
                    } else {
                        line.setAttribute('class', 'connection-line teased');
                    }
                    svgContainer.appendChild(line);
                }
            }
        });
    }

    private getUpgradeState(upgrade: Upgrade): 'hidden' | 'teased' | 'revealed' {
        if (!upgrade.dependency) return 'revealed';

        const depUpgrade = this.upgrades.find(u => u.id === upgrade.dependency!.upgradeId)!;
        if (depUpgrade.level >= upgrade.dependency.minLevel) {
            return 'revealed';
        } else if (depUpgrade.level >= upgrade.dependency.teaseLevel) {
            return 'teased';
        } else {
            return 'hidden';
        }
    }

    private isDependencyMet(upgrade: Upgrade): boolean {
        if (!upgrade.dependency) return true;
        const depUpgrade = this.upgrades.find(u => u.id === upgrade.dependency!.upgradeId)!;
        return depUpgrade.level >= upgrade.dependency!.minLevel;
    }

    private buyUpgrade(upgrade: Upgrade): void {
        const price = upgrade.prices[upgrade.level];
        if (ScoreManager.Instance.score >= price && this.isDependencyMet(upgrade)) {
            // Deduct points
            ScoreManager.Instance.addScore(-price);

            // Increment upgrade level
            upgrade.level++;
            UpgradeShop.levels[upgrade.id] = upgrade.level;

            // Trigger hook
            UpgradeShop.onUpgradePurchased.forEach(cb => cb(upgrade.id, upgrade.level));

            // Refresh HTML
            this.updateHTML();
        }
    }
}

