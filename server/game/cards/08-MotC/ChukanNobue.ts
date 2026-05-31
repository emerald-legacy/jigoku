import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ChukanNobue extends DrawCard {
    static id = 'chukan-nobue';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'discard',
                restricts: 'opponentsTriggeredAbilities'
            })
        });
    }
}

export default ChukanNobue;
