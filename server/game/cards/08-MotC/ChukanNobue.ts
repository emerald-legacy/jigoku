import DrawCard from '../../DrawCard.js';
import { playerCannot } from '../../effects.js';
import { RestrictionType, RestrictionScope } from '../../Constants.js';

class ChukanNobue extends DrawCard {
    static id = 'chukan-nobue';

    setupCardAbilities() {
        this.persistentEffect({
            effect: playerCannot({
                cannot: RestrictionType.Discard,
                appliesTo: RestrictionScope.OpponentsTriggeredAbilities
            })
        });
    }
}

export default ChukanNobue;
