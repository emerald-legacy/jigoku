import * as AbilityLimit from './AbilityLimit.js';
import Effects from './effects.js';
import * as boardCosts from './costs/boardCosts.js';
import * as fateAndHonorCosts from './costs/fateAndHonorCosts.js';
import * as variableAndOptionalCosts from './costs/variableAndOptionalCosts.js';
import * as GameActions from './GameActions/GameActions.js';
import { setGameActionCatalog } from './GameActions/GameActionRegistry.js';
import { setAbilityDsl } from './AbilityDslProvider.js';

setGameActionCatalog({ ...GameActions });

const AbilityDsl = {
    limit: AbilityLimit,
    effects: Effects,
    costs: { ...boardCosts, ...fateAndHonorCosts, ...variableAndOptionalCosts },
    actions: GameActions
};

setAbilityDsl(AbilityDsl);

export default AbilityDsl;
