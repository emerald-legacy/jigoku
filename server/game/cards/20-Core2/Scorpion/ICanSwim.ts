import { discardFromPlay } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ICanSwim extends DrawCard {
    static id = 'i-can-swim';

    override setupCardAbilities() {
        this.conflictAction('Discard a dishonored character')
            .ifCondition((context) => !!(context.player.opponent && context.player.showBid > context.player.opponent.showBid))
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating() && card.isDishonored
            }, discardFromPlay())
            .cannotBeMirrored();
    }
}
