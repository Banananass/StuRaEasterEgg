import {GameObject} from './Engine/GameObject.js';
import {ScoreManager} from './ScoreManager.js';
import {Upgrade, INITIAL_UPGRADES} from './UpgradeData.js';
import {Localization} from './Localization.js';

/**
 * UpgradeShop – manages the upgrade tree UI: purchasing, DOM rendering,
 * zoom/pan, and persistence hooks.
 */
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
    private gameRoot: HTMLElement | null = null;

    // Zoom and Pan States
    private zoomScale: number = 1.0;
    private panX: number = 0;
    private panY: number = 0;
    private isDragging: boolean = false;
    private dragStartX: number = 0;
    private dragStartY: number = 0;

    // Extra space (in grid px) kept between the outermost visible node and the pan wall
    private static readonly PAN_WALL_BUFFER = 300;
    // World-space (grid) bounds of currently visible nodes, incl. buffer. Only
    // recomputed when the set of visible nodes can have changed (see updateHTML).
    private panBounds = {minX: 0, maxX: 0, minY: 0, maxY: 0};

    private upgrades: Upgrade[] = [];

    constructor() {
        super();
        UpgradeShop.Instance = this;
        // Deep copy the initial upgrade configurations
        this.upgrades = JSON.parse(JSON.stringify(INITIAL_UPGRADES));
        this.upgrades.forEach(u => {
            if (UpgradeShop.levels[u.id] === undefined) {
                UpgradeShop.levels[u.id] = u.level;
            } else {
                // Sync from any level already known (e.g. restored from a save)
                u.level = UpgradeShop.levels[u.id];
            }
        });
    }

    public static getUpgradeLevel(id: string): number {
        return this.levels[id] || 0;
    }

    /**
     * Returns a shallow copy of every upgrade's current level, keyed by id.
     * Used by the save system to serialize progress.
     */
    public static getAllLevels(): Record<string, number> {
        return {...this.levels};
    }

    /**
     * Applies a set of upgrade levels (e.g. restored from a save file).
     * Ignores unknown ids and clamps to each upgrade's level cap.
     */
    public static applyLevels(levels: Record<string, number>): void {
        for (const [id, level] of Object.entries(levels)) {
            if (typeof level === 'number' && level >= 0) {
                this.levels[id] = level;
            }
        }
        if (this.Instance) {
            this.Instance.upgrades.forEach(u => {
                if (levels[u.id] !== undefined) {
                    u.level = Math.max(0, Math.min(levels[u.id], u.levelCap));
                    this.levels[u.id] = u.level;
                }
            });
            this.Instance.updateHTML();
        }
    }

    /** Resets every upgrade back to level 0. */
    public static resetProgress(): void {
        for (const id of Object.keys(this.levels)) {
            this.levels[id] = 0;
        }
        if (this.Instance) {
            this.Instance.upgrades.forEach(u => u.level = 0);
            this.Instance.buttonUnlocked = false;
            if (this.Instance.shopButton) {
                this.Instance.shopButton.classList.remove('visible');
            }
            this.Instance.updateHTML();
        }
    }

    /** Closes the shop overlay if it is currently open. */
    public static close(): void {
        if (this.Instance && this.isOpen) {
            this.Instance.closeShop();
        }
    }

    /** Opens the shop overlay. */
    public static open(): void {
        if (this.Instance && !this.isOpen) {
            this.Instance.openShop();
        }
    }

    /** Opens the shop if closed, or closes it if open. */
    public static toggle(): void {
        if (this.isOpen) this.close();
        else this.open();
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
        this.gameRoot = document.getElementById('game-root');

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

        // Click outside the shop overlay content closes it
        document.addEventListener('click', (e: MouseEvent) => {
            if (!UpgradeShop.isOpen || !this.shopOverlay) return;
            const target = e.target as Node | null;
            if (target && !this.shopOverlay.contains(target) && (!this.shopButton || !this.shopButton.contains(target))) {
                this.closeShop();
            }
        });

        // Fetch scalable contents wrapper
        const content = document.getElementById('upgrade-shop-content');
        if (content) {
            this.shopContent = content as HTMLDivElement;
        }

        this.setupZoomAndPan();
        this.updateHTML();

        // Re-render dynamic shop content whenever the active language changes
        Localization.onChange.push(() => this.updateHTML());
    }

    private setupZoomAndPan(): void {
        const graphViewport = document.getElementById('upgrade-shop-graph');
        if (!graphViewport || !this.shopContent) return;

        const MIN_ZOOM = 0.2;
        const MAX_ZOOM = 2.5;

        // Reset transforms, centering the grid origin (0, 0) in the viewport
        this.zoomScale = 1.0;
        this.updateBounds();
        this.centerView();

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

            this.clampPan();
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
            this.clampPan();
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
            // Round the pan offset to whole pixels - fractional translate values
            // cause the browser to sub-pixel-render (blur) the scaled node content.
            const x = Math.round(this.panX);
            const y = Math.round(this.panY);
            this.shopContent.style.transform = `translate(${x}px, ${y}px) scale(${this.zoomScale})`;
        }
    }

    /**
     * Centers the grid origin (0, 0) within the graph viewport. Since node
     * coordinates are absolute grid units (px), the viewport size must be
     * factored in to keep the tree visually centered on open/reset.
     */
    private centerView(): void {
        const graphViewport = document.getElementById('upgrade-shop-graph');
        if (graphViewport) {
            const rect = graphViewport.getBoundingClientRect();
            this.panX = rect.width / 2;
            this.panY = rect.height / 2;
        } else {
            this.panX = 0;
            this.panY = 0;
        }
        this.clampPan();
        this.applyTransform();
    }

    /**
     * Recomputes the pan-wall bounds from the currently visible (non-hidden)
     * nodes. Only needs to run when the set of visible nodes can have
     * changed, i.e. on initial render and whenever purchasing an upgrade may
     * newly tease a node - both of which go through updateHTML().
     */
    private updateBounds(): void {
        const visible = this.upgrades.filter(u => this.getUpgradeState(u) !== 'hidden');
        if (visible.length === 0) {
            this.panBounds = {minX: 0, maxX: 0, minY: 0, maxY: 0};
            return;
        }

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (const u of visible) {
            minX = Math.min(minX, u.x);
            maxX = Math.max(maxX, u.x);
            minY = Math.min(minY, u.y);
            maxY = Math.max(maxY, u.y);
        }

        const buffer = UpgradeShop.PAN_WALL_BUFFER;
        this.panBounds = {
            minX: minX - buffer,
            maxX: maxX + buffer,
            minY: minY - buffer,
            maxY: maxY + buffer
        };
    }

    /**
     * Clamps panX/panY so the walls (bounds of the visible node tree, plus
     * buffer) can never be dragged/zoomed further than the viewport edge,
     * preventing panning into empty space beyond what's necessary.
     */
    private clampPan(): void {
        const graphViewport = document.getElementById('upgrade-shop-graph');
        if (!graphViewport) return;

        const rect = graphViewport.getBoundingClientRect();
        const {minX, maxX, minY, maxY} = this.panBounds;

        // Screen position of a wall = pan + gridCoord * zoom. Keep walls at
        // or beyond the viewport edges (never revealing empty space past them).
        const minPanX = rect.width - maxX * this.zoomScale;
        const maxPanX = -minX * this.zoomScale;
        this.panX = minPanX <= maxPanX
            ? Math.min(maxPanX, Math.max(minPanX, this.panX))
            : (minPanX + maxPanX) / 2; // graph narrower than viewport: center it

        const minPanY = rect.height - maxY * this.zoomScale;
        const maxPanY = -minY * this.zoomScale;
        this.panY = minPanY <= maxPanY
            ? Math.min(maxPanY, Math.max(minPanY, this.panY))
            : (minPanY + maxPanY) / 2;
    }

    private openShop(): void {
        UpgradeShop.isOpen = true;
        if (this.shopOverlay) {
            this.shopOverlay.style.display = 'flex';
        }
        if (this.gameRoot) {
            this.gameRoot.classList.add('blurred');
        }

        // Reset transform to default when opening the shop for consistency
        this.zoomScale = 1.0;
        this.centerView();

        this.updateHTML();
    }

    private closeShop(): void {
        UpgradeShop.isOpen = false;
        if (this.shopOverlay) {
            this.shopOverlay.style.display = 'none';
        }
        if (this.gameRoot) {
            this.gameRoot.classList.remove('blurred');
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
            nodeEl.style.left = `${upgrade.x}px`;
            nodeEl.style.top = `${upgrade.y}px`;

            if (state === 'teased') {
                const dep = upgrade.dependency!;
                const depUpgrade = this.upgrades.find(u => u.id === dep.upgradeId)!;
                const requirementText = Localization.t('shop.requirementLevel', {name: depUpgrade.name[Localization.locale], level: dep.minLevel});
                nodeEl.innerHTML = `
                    <div class="node-icon">🔒</div>
                    <div class="node-title">${Localization.t('shop.locked')}</div>
                    <div class="node-desc teaser">${Localization.t('shop.requires', {req: requirementText})}</div>
                `;
            } else {
                const isMax = upgrade.level >= upgrade.levelCap;
                const price = isMax ? 0 : upgrade.prices[upgrade.level];
                const canAfford = ScoreManager.Instance.score >= price;
                const depMet = this.isDependencyMet(upgrade);
                const showBuyButton = !isMax;

                nodeEl.innerHTML = `
                    <div class="node-title">${upgrade.name[Localization.locale]}</div>
                    <div class="node-desc flavour">${upgrade.flavourText[Localization.locale]}</div>
                    <div class="node-desc effect">${upgrade.effectText[Localization.locale]}</div>
                    <div class="node-level">${Localization.t('shop.level')}: ${upgrade.level} / ${upgrade.levelCap}</div>
                    ${showBuyButton ? `
                        <button class="node-buy-btn" ${(!canAfford || !depMet) ? 'disabled' : ''}>
                            ${Localization.t('shop.buy')} (${price} 🧃)
                        </button>
                    ` : `
                        <div class="node-max">${Localization.t('shop.max')}</div>
                    `}
                `;

                if (showBuyButton) {
                    const buyBtn = nodeEl.querySelector('.node-buy-btn');
                    if (buyBtn && canAfford && depMet) {
                        buyBtn.addEventListener('click', (e: Event) => {
                            // Prevent bubbling to the document click listener, which would
                            // otherwise see the (now-detached, after updateHTML() rebuilds
                            // the node list) button as "outside" the overlay and close the shop.
                            e.stopPropagation();
                            this.buyUpgrade(upgrade);
                        });
                    }
                }
            }

            nodesContainer.appendChild(nodeEl);

            // Draw a link from the dependency to this node
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

        // The set of visible nodes may have changed (new tease/reveal), so
        // refresh the pan walls and re-clamp the current view against them.
        this.updateBounds();
        this.clampPan();
        this.applyTransform();
    }

    private getUpgradeState(upgrade: Upgrade): 'hidden' | 'teased' | 'revealed' {
        if (!upgrade.dependency) return 'revealed';

        const dep = upgrade.dependency;
        const depUpgrade = this.upgrades.find(u => u.id === dep.upgradeId)!;

        if (depUpgrade.level >= dep.minLevel) return 'revealed';
        if (depUpgrade.level >= dep.teaseLevel) return 'teased';
        return 'hidden';
    }

    private isDependencyMet(upgrade: Upgrade): boolean {
        if (!upgrade.dependency) return true;
        const depUpgrade = this.upgrades.find(u => u.id === upgrade.dependency!.upgradeId)!;
        return depUpgrade.level >= upgrade.dependency.minLevel;
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

