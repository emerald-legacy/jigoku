import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { RestrictionType, RestrictionScope } from '../../Constants.js';

class IchigenkinSoloist extends DrawCard {
    static id = 'ichigenkin-soloist';

    setupCardAbilities() {
        this.composure({
            effect: cardCannot({
                cannot: RestrictionType.Target,
                appliesTo: RestrictionScope.OpponentsTriggeredAbilities
            })
        });
    }
}


export default IchigenkinSoloist;
