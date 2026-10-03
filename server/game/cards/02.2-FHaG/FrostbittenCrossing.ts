import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class FrostbittenCrossing extends ProvinceCard {
    static id = 'frostbitten-crossing';

    setupCardAbilities() {
        this.action('Discard all attachments from a character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.attachments.length > 0
            })
            .gameAction(AbilityDsl.actions.discardFromPlay((context) => ({
                target: context.target.attachments
            })))
            .effect('remove all attachments from {0}');
    }
}
