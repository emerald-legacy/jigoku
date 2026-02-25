import * as AbilityLimit from './AbilityLimit';
import * as Effects from './effects.js';
import * as Costs from './Costs';
import * as GameActions from './GameActions/GameActions';

const AbilityDsl = {
    limit: AbilityLimit,
    effects: Effects,
    costs: Costs,
    actions: GameActions
};

export = AbilityDsl;
