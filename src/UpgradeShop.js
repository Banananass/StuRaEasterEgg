import { GameObject } from './Engine/GameObject.js';
import { ScoreManager } from './ScoreManager.js';
import { INITIAL_UPGRADES } from './UpgradeData.js';
import { Localization } from './Localization.js';
//TODO: Untangle
export class UpgradeShop extends GameObject {
    static Instance = null;
    static isOpen = false;
    static levels = {};
    static onUpgradePurchased = [];
    buttonUnlocked = false;
    // DOM Elements
    shopButton;
    shopOverlay;
    shopContent;
    gameRoot = null;
    // Zoom and Pan States
    zoomScale = 1.0;
    panX = 0;
    panY = 0;
    isDragging = false;
    dragStartX = 0;
    dragStartY = 0;
    upgrades = [];
    constructor() {
        super();
        UpgradeShop.Instance = this;
        // Deep copy the initial upgrade configurations
        this.upgrades = JSON.parse(JSON.stringify(INITIAL_UPGRADES));
        this.upgrades.forEach(u => {
            if (UpgradeShop.levels[u.id] === undefined) {
                UpgradeShop.levels[u.id] = u.level;
            }
            else {
                // Sync from any level already known (e.g. restored from a save)
                u.level = UpgradeShop.levels[u.id];
            }
        });
    }
    static getUpgradeLevel(id) {
        return this.levels[id] || 0;
    }
    /**
     * Returns a shallow copy of every upgrade's current level, keyed by id.
     * Used by the save system to serialize progress.
     */
    static getAllLevels() {
        return { ...this.levels };
    }
    /**
     * Applies a set of upgrade levels (e.g. restored from a save file).
     * Ignores unknown ids and clamps to each upgrade's level cap.
     */
    static applyLevels(levels) {
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
    /**
     * Resets every upgrade back to level 0. Used by the pause menu's
     * "reset progress" button.
     */
    static resetProgress() {
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
    static close() {
        if (this.Instance && this.isOpen) {
            this.Instance.closeShop();
        }
    }
    /** Opens the shop overlay (e.g. via the Space key). */
    static open() {
        if (this.Instance && !this.isOpen) {
            this.Instance.openShop();
        }
    }
    /** Opens the shop if closed, or closes it if open. */
    static toggle() {
        if (this.isOpen)
            this.close();
        else
            this.open();
    }
    start() {
        this.initDOM();
    }
    update() {
        // Show button after 3 points are gathered
        if (!this.buttonUnlocked && ScoreManager.Instance.score >= 3) {
            this.buttonUnlocked = true;
            if (this.shopButton) {
                this.shopButton.classList.add('visible');
            }
        }
    }
    initDOM() {
        this.gameRoot = document.getElementById('game-root');
        // Fetch pre-existing upgrade shop button from DOM
        const btn = document.getElementById('upgrade-shop-btn');
        if (btn) {
            this.shopButton = btn;
            this.shopButton.addEventListener('click', () => this.openShop());
        }
        // Fetch pre-existing upgrade shop overlay from DOM
        const overlay = document.getElementById('upgrade-shop-overlay');
        if (overlay) {
            this.shopOverlay = overlay;
            // Hook close button within the pre-constructed HTML
            const closeBtn = this.shopOverlay.querySelector('.shop-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeShop());
            }
        }
        // Click outside the shop overlay content closes it
        document.addEventListener('click', (e) => {
            if (!UpgradeShop.isOpen || !this.shopOverlay)
                return;
            const target = e.target;
            if (target && !this.shopOverlay.contains(target) && (!this.shopButton || !this.shopButton.contains(target))) {
                this.closeShop();
            }
        });
        // Fetch scalable contents wrapper
        const content = document.getElementById('upgrade-shop-content');
        if (content) {
            this.shopContent = content;
        }
        this.setupZoomAndPan();
        this.updateHTML();
        // Re-render dynamic shop content whenever the active language changes
        Localization.onChange.push(() => this.updateHTML());
    }
    setupZoomAndPan() {
        const graphViewport = document.getElementById('upgrade-shop-graph');
        if (!graphViewport || !this.shopContent)
            return;
        const MIN_ZOOM = 0.5;
        const MAX_ZOOM = 3.0;
        // Reset transforms
        this.zoomScale = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.applyTransform();
        // 1. Mouse wheel zoom focusing on mouse coordinates
        graphViewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSpeed = 0.08;
            const rect = graphViewport.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const oldScale = this.zoomScale;
            if (e.deltaY < 0) {
                this.zoomScale = Math.min(MAX_ZOOM, this.zoomScale + zoomSpeed);
            }
            else {
                this.zoomScale = Math.max(MIN_ZOOM, this.zoomScale - zoomSpeed);
            }
            // Pivot panning relative to cursor
            this.panX = mouseX - (mouseX - this.panX) * (this.zoomScale / oldScale);
            this.panY = mouseY - (mouseY - this.panY) * (this.zoomScale / oldScale);
            this.applyTransform();
        }, { passive: false });
        // 2. Mouse drag panning
        graphViewport.addEventListener('mousedown', (e) => {
            if (e.button !== 0 && e.button !== 1)
                return;
            this.isDragging = true;
            this.dragStartX = e.clientX - this.panX;
            this.dragStartY = e.clientY - this.panY;
        });
        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging || !this.shopOverlay || this.shopOverlay.style.display === 'none')
                return;
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
    applyTransform() {
        if (this.shopContent) {
            this.shopContent.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomScale})`;
        }
    }
    openShop() {
        UpgradeShop.isOpen = true;
        if (this.shopOverlay) {
            this.shopOverlay.style.display = 'flex';
        }
        if (this.gameRoot) {
            this.gameRoot.classList.add('blurred');
        }
        // Reset transform to default when opening the shop for consistency
        this.zoomScale = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.applyTransform();
        this.updateHTML();
    }
    closeShop() {
        UpgradeShop.isOpen = false;
        if (this.shopOverlay) {
            this.shopOverlay.style.display = 'none';
        }
        if (this.gameRoot) {
            this.gameRoot.classList.remove('blurred');
        }
    }
    updateHTML() {
        // Update points
        const pointsVal = document.getElementById('shop-points-val');
        if (pointsVal) {
            pointsVal.textContent = String(ScoreManager.Instance.score);
        }
        const nodesContainer = document.getElementById('upgrade-shop-nodes');
        const svgContainer = document.getElementById('upgrade-shop-svg');
        if (!nodesContainer || !svgContainer)
            return;
        nodesContainer.innerHTML = '';
        svgContainer.innerHTML = '';
        // Draw connections and render cards
        this.upgrades.forEach(upgrade => {
            const state = this.getUpgradeState(upgrade);
            if (state === 'hidden')
                return;
            // Render node
            const nodeEl = document.createElement('div');
            nodeEl.className = `upgrade-node ${state}`;
            nodeEl.style.left = `${upgrade.x}%`;
            nodeEl.style.top = `${upgrade.y}%`;
            if (state === 'teased') {
                const deps = upgrade.dependencies;
                const requirementText = deps
                    .map(dep => {
                    const depUpgrade = this.upgrades.find(u => u.id === dep.upgradeId);
                    return Localization.t('shop.requirementLevel', { name: depUpgrade.name[Localization.locale], level: dep.minLevel });
                })
                    .join(` ${Localization.t('shop.and')} `);
                nodeEl.innerHTML = `
                    <div class="node-icon">🔒</div>
                    <div class="node-title">${Localization.t('shop.locked')}</div>
                    <div class="node-desc teaser">${Localization.t('shop.requires', { req: requirementText })}</div>
                `;
            }
            else {
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
                        buyBtn.addEventListener('click', (e) => {
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
            // Draw links from each dependency to this node
            if (upgrade.dependencies) {
                for (const dep of upgrade.dependencies) {
                    const depUpgrade = this.upgrades.find(u => u.id === dep.upgradeId);
                    const depState = this.getUpgradeState(depUpgrade);
                    if (depState === 'hidden')
                        continue;
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', String(depUpgrade.x));
                    line.setAttribute('y1', String(depUpgrade.y));
                    line.setAttribute('x2', String(upgrade.x));
                    line.setAttribute('y2', String(upgrade.y));
                    // Style the line based on target node state
                    if (state === 'revealed') {
                        line.setAttribute('class', 'connection-line revealed');
                    }
                    else {
                        line.setAttribute('class', 'connection-line teased');
                    }
                    svgContainer.appendChild(line);
                }
            }
        });
    }
    getUpgradeState(upgrade) {
        if (!upgrade.dependencies || upgrade.dependencies.length === 0)
            return 'revealed';
        let allRevealed = true;
        let allTeased = true;
        for (const dep of upgrade.dependencies) {
            const depUpgrade = this.upgrades.find(u => u.id === dep.upgradeId);
            if (depUpgrade.level < dep.minLevel)
                allRevealed = false;
            if (depUpgrade.level < dep.teaseLevel)
                allTeased = false;
        }
        if (allRevealed)
            return 'revealed';
        if (allTeased)
            return 'teased';
        return 'hidden';
    }
    isDependencyMet(upgrade) {
        if (!upgrade.dependencies)
            return true;
        return upgrade.dependencies.every(dep => {
            const depUpgrade = this.upgrades.find(u => u.id === dep.upgradeId);
            return depUpgrade.level >= dep.minLevel;
        });
    }
    buyUpgrade(upgrade) {
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
//# sourceMappingURL=UpgradeShop.js.map