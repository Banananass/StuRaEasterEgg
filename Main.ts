/**
 * Main.ts – Entry point
 */

import {Beaver} from './src/Beaver.js';
import {JuiceboxSpawner} from './src/JuiceboxSpawner.js';
import {Engine} from "./src/Engine/Engine.js";

const beaver: Beaver = new Beaver();
const JuiceBoxSpawner: JuiceboxSpawner = new JuiceboxSpawner();

Engine.Instance.start();