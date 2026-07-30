/**
 * Main.ts – Entry point
 */

import {Beaver} from './src/Beaver.js';
import {JuiceboxSpawner} from './src/JuiceboxSpawner.js';
import {Engine} from "./src/Engine/Engine.js";
import {UpgradeShop} from "./src/UpgradeShop.js";
import {FullscreenManager} from "./src/Engine/FullscreenManager.js";
import {PauseMenu} from "./src/PauseMenu.js";
import {SaveManager} from "./src/SaveManager.js";
import {Localization} from "./src/Localization.js";
import {ScoreManager} from "./src/ScoreManager.js";

// Restore saved language and translate static DOM before anything else renders.
Localization.init();

const fullscreenManager: FullscreenManager = new FullscreenManager('fullscreen-btn');
const pauseMenu: PauseMenu = new PauseMenu('menu-btn', 'pause-menu-overlay', 'pause-menu-content');

// Debug helper: instantly grants 1000 juice for testing upgrades/purchases.
const debugAddJuiceBtn = document.getElementById('debug-add-juice-btn');
if (debugAddJuiceBtn) {
    debugAddJuiceBtn.addEventListener('click', () => ScoreManager.Instance.addScore(1000));
}

const beaver: Beaver = new Beaver();
const JuiceBoxSpawner: JuiceboxSpawner = new JuiceboxSpawner();
const upgradeShop: UpgradeShop = new UpgradeShop();

console.log("Starting game...");

Engine.Instance.start();

// Restore progress now that all singletons (Beaver, UpgradeShop, JuiceboxSpawner) exist.
SaveManager.load();

// Persist progress whenever it changes, and as a safety net before the tab closes.
UpgradeShop.onUpgradePurchased.push(() => SaveManager.save());
window.addEventListener('beforeunload', () => SaveManager.save());
setInterval(() => SaveManager.save(), 10000);

// Escape/Space are handled centrally here so the pause menu and upgrade shop
// are never open at the same time.
window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    if (e.code === 'Escape') {
        if (UpgradeShop.isOpen) UpgradeShop.close();
        else if (PauseMenu.isOpen) pauseMenu.close();
        else{
            e.preventDefault();
            pauseMenu.open();
        }
    } else if (e.code === 'Space') {
        if (PauseMenu.isOpen) return;
        e.preventDefault();
        UpgradeShop.toggle();
    }
});