import DrawCard from '../../DrawCard.js';
import { playerCannot } from '../../effects.js';
import { RestrictionType } from '../../Constants.js';

class ChukanNobue extends DrawCard {
    static id = 'chukan-nobue';

    setupCardAbilities() {
        this.persistentEffect({
            effect: playerCannot({
                cannot: RestrictionType.Discard,
                restricts: 'opponentsTriggeredAbilities'
            })
        });
    }
}

export default ChukanNobue;
