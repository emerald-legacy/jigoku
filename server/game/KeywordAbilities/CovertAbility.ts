import BaseAbility from '../baseability.js';
import { AbilityTypes } from '../Constants.js';

class CovertAbility extends BaseAbility {
    title: string;

    constructor() {
        super({});
        this.title = 'covert';
        this.abilityType = AbilityTypes.KeywordReaction;
    }

    isCardAbility() {
        return true;
    }

    isKeywordAbility() {
        return true;
    }
}

export default CovertAbility;
