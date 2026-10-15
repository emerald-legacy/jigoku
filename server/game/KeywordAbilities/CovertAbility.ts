import { BaseAbility } from '../BaseAbility.js';
import { AbilityType } from '../Constants.js';

export class CovertAbility extends BaseAbility {
    override title: string;

    constructor() {
        super({});
        this.title = 'covert';
        this.abilityType = AbilityType.KeywordReaction;
    }

    override isCardAbility() {
        return true;
    }

    override isKeywordAbility() {
        return true;
    }
}

