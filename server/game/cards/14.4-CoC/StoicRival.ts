import { CardType } from '../../Constants.js';
import { dishonor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class StoicRival extends DrawCard {
    static id = 'stoic-rival';

    setupCardAbilities() {
        this.action('Dishonor a participating character with fewer attachments')
            .condition((context) => context.source.attachments.length > 0 && context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.attachments.length < context.source.attachments.length
            }, dishonor());
    }
}
