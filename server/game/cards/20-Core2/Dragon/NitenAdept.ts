import { CardType } from '../../../Constants.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class NitenAdept extends DrawCard {
    static id = 'niten-adept';

    override setupCardAbilities() {
        this.conflictAction('Bow character')
            .condition((context) => context.source.attachments.some((attachment) => attachment.controller === context.player))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.attachments.length === 0
            }, bow());
    }
}
