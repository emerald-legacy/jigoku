import { cardCannot } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { RestrictionType, RestrictionScope } from '../../../Constants.js';

export default class AboveQuestion extends DrawCard {
    static id = 'above-question';

    setupCardAbilities() {
        this.whileAttached({
            effect: cardCannot({
                cannot: RestrictionType.Target,
                appliesTo: RestrictionScope.OpponentsEvents,
                source: this
            })
        });
    }
}
