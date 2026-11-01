import * as GameActions from './GameActions/GameActions.js';
import { setGameActionCatalog } from './GameActions/GameActionRegistry.js';

// fills the registry allowGameAction looks names up in; imported once at startup (game node, test helpers)
setGameActionCatalog({ ...GameActions });
