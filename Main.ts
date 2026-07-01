/**
 * Main.ts – Entry point
 */

import {Beaver} from './src/Beaver.js';
import {JuiceboxSpawner} from './src/JuiceboxSpawner.js';
import {Engine} from "./src/Engine/Engine.js";
import {UpgradeShop} from "./src/UpgradeShop.js";
import {FullscreenManager} from "./src/Engine/FullscreenManager.js";

const fullscreenManager: FullscreenManager = new FullscreenManager('fullscreen-btn');

const beaver: Beaver = new Beaver();
const JuiceBoxSpawner: JuiceboxSpawner = new JuiceboxSpawner();
const upgradeShop: UpgradeShop = new UpgradeShop();

console.log("Starting game...");

Engine.Instance.start();