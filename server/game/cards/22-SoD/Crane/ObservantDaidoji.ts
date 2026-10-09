import { cardCannot } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { RestrictionType, RestrictionScope } from '../../../Constants.js';

export default class ObservantDaidoji extends DrawCard {
    static id = 'observant-daidoji';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDishonored,
            effect: cardCannot({
                cannot: RestrictionType.Target,
                appliesTo: RestrictionScope.OpponentsEvents
            })
        });
    }
}
