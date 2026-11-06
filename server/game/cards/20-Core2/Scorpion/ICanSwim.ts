import { discardFromPlay } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ICanSwim extends DrawCard {
    static id = 'i-can-swim';

    override setupCardAbilities() {
        this.conflictAction('Discard a dishonored character')
            .ifCondition((context) => !!(context.player.opponent && context.player.showBid > context.player.opponent.showBid))
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    !!context.player.opponent && card.isParticipatingFor(context.player.opponent) && card.isDishonored
            }, discardFromPlay())
            .cannotBeMirrored();
    }
}
