import * as AbilityLimit from './AbilityLimit.js';
import Effects from './effects.js';
import * as Costs from './Costs.js';
import * as GameActions from './GameActions/GameActions.js';

const AbilityDsl = {
    limit: AbilityLimit,
    effects: Effects,
    costs: Costs,
    actions: GameActions
};

export default AbilityDsl;
