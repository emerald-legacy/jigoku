import DrawCard from '../../DrawCard.js';
import { playerCannot } from '../../effects.js';

class ChukanNobue extends DrawCard {
    static id = 'chukan-nobue';

    setupCardAbilities() {
        this.persistentEffect({
            effect: playerCannot({
                cannot: 'discard',
                restricts: 'opponentsTriggeredAbilities'
            })
        });
    }
}

export default ChukanNobue;
