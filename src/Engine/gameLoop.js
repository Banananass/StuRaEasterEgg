/**
 * gameLoop.ts – Entry point
 *
 * Wires together the engine and all game objects.
 */
import { Engine } from './Engine.js';
import { Beaver } from '../Beaver.js';
import { Juicebox } from '../Juicebox.js';
import { ScoreManager } from '../ScoreManager.js';
console.log("test");
const engine = new Engine('c');
const scoreManager = new ScoreManager();
const beaver = new Beaver(engine);
new Juicebox(engine, beaver, scoreManager);
engine.start();
//# sourceMappingURL=gameLoop.js.map