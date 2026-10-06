import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';
import { modifyGlory } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';

export default class UsogawaToko extends DrawCard {
    static id = 'usogawa-toko';

    setupCardAbilities() {
        this.conflictAction('Give a participating character -3 glory')
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, cardLastingEffect({
                effect: modifyGlory(-3)
            }))
            .effect('give {0} -3 glory until the end of the conflict');
    }
}
