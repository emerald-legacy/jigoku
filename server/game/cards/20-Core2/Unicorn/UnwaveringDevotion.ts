import { cardCannot, modifyGlory } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { RestrictionType, RestrictionScope } from '../../../Constants.js';

export default class UnwaveringDevotion extends DrawCard {
    static id = 'unwavering-devotion';

    override setupCardAbilities() {
        this.whileAttached({
            effect: modifyGlory(1)
        });

        this.whileAttached({
            effect: cardCannot({
                cannot: RestrictionType.Target,
                appliesTo: RestrictionScope.OpponentsCharacterAbilitiesWithLowerGlory
            })
        });
    }
}
