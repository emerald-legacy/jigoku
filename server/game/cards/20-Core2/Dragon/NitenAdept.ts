import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class NitenAdept extends DrawCard {
    static id = 'niten-adept';

    setupCardAbilities() {
        this.action('Bow character')
            .cost(AbilityDsl.costs.bow({
                cardType: CardType.Attachment,
                cardCondition: (card, context) => card.parentCharacter === context.source
            }))
            .condition((context) => context.source.attachments.length > 0 && context.source.isParticipating())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.attachments.length === 0
            }, AbilityDsl.actions.bow());
    }
}
