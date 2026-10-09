import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { RestrictionType } from '../../Constants.js';

class IchigenkinSoloist extends DrawCard {
    static id = 'ichigenkin-soloist';

    setupCardAbilities() {
        this.composure({
            effect: cardCannot({
                cannot: RestrictionType.Target,
                restricts: 'opponentsTriggeredAbilities'
            })
        });
    }
}


export default IchigenkinSoloist;
