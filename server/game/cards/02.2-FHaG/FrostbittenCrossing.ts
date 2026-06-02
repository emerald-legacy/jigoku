import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class FrostbittenCrossing extends ProvinceCard {
    static id = 'frostbitten-crossing';

    setupCardAbilities() {
        this.action({
            title: 'Discard all attachments from a character',
            target: {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.attachments.length > 0
            },
            effect: 'remove all attachments from {0}',
            gameAction: AbilityDsl.actions.discardFromPlay((context) => ({
                target: context.target.attachments
            }))
        });
    }
}
