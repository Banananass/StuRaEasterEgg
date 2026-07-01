/**
 * Main.ts – Entry point
 */
import { Beaver } from './src/Beaver.js';
import { JuiceboxSpawner } from './src/JuiceboxSpawner.js';
import { Engine } from "./src/Engine/Engine.js";
import { UpgradeShop } from "./src/UpgradeShop.js";
const beaver = new Beaver();
const JuiceBoxSpawner = new JuiceboxSpawner();
const upgradeShop = new UpgradeShop();
console.log("Starting game...");
Engine.Instance.start();
//# sourceMappingURL=Main.js.map