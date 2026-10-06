import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

export default class FrostbittenCrossing extends ProvinceCard {
    static id = 'frostbitten-crossing';

    setupCardAbilities() {
        this.action('Discard all attachments from a character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.attachments.length > 0
            })
            .gameAction(discardFromPlay((context) => ({
                target: context.target.attachments
            })))
            .effect('remove all attachments from {0}');
    }
}
