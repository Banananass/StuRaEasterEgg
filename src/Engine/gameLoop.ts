/**
 * gameLoop.ts – Entry point
 *
 * Wires together the engine and all game objects.
 */
import {Engine} from './Engine.js';
import {Beaver} from '../Beaver.js';
import {Juicebox} from '../Juicebox.js';
import {ScoreManager} from '../ScoreManager.js';

console.log("test");

const engine: Engine = new Engine('c');
const scoreManager: ScoreManager = new ScoreManager();

const beaver: Beaver = new Beaver(engine);
new Juicebox(engine, beaver, scoreManager);

engine.start();
