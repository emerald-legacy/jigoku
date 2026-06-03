import BaseAbility from '../BaseAbility.js';
import { AbilityType } from '../Constants.js';

class CovertAbility extends BaseAbility {
    title: string;

    constructor() {
        super({});
        this.title = 'covert';
        this.abilityType = AbilityType.KeywordReaction;
    }

    isCardAbility() {
        return true;
    }

    isKeywordAbility() {
        return true;
    }
}

export default CovertAbility;
