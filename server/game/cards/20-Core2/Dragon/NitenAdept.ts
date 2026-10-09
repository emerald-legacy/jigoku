import { CardType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class NitenAdept extends DrawCard {
    static id = 'niten-adept';

    setupCardAbilities() {
        this.conflictAction('Bow character')
            .cost(costs.bow({
                cardType: CardType.Attachment,
                cardCondition: (card, context) => card.parentCharacter === context.source
            }))
            .condition((context) => context.source.attachments.length > 0)
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.attachments.length === 0
            }, bow());
    }
}
