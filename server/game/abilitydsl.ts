import * as AbilityLimit from './AbilityLimit.js';
import Effects from './effects.js';
import * as Costs from './Costs.js';
import * as GameActions from './GameActions/GameActions.js';
import { setGameActionCatalog } from './GameActions/GameActionRegistry.js';
import { setAbilityDsl } from './AbilityDslProvider.js';

setGameActionCatalog({ ...GameActions });

const AbilityDsl = {
    limit: AbilityLimit,
    effects: Effects,
    costs: Costs,
    actions: GameActions
};

setAbilityDsl(AbilityDsl);

export default AbilityDsl;
