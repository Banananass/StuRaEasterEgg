/**
 * Main.ts – Entry point
 *
 * Wires together the engine and all game objects.
 */
import { Beaver } from './src/Beaver.js';
import { JuiceboxSpawner } from './src/JuiceboxSpawner.js';
import { Engine } from "./src/Engine/Engine.js";
const beaver = new Beaver();
const JuiceBoxSpawner = new JuiceboxSpawner();
Engine.Instance.start();
//# sourceMappingURL=Main.js.map