import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { discardCard, dishonor, multipleContext } from '../../../GameActions/GameActions.js';

export default class AncestorAttendant extends DrawCard {
    static id = 'ancestor-attendant';

    setupCardAbilities() {
        this.conflictAction('Dishonor a character')
            .target({
                cardCondition: (card, context) => !!context.player.opponent &&
                    card.isParticipatingFor(context.player.opponent) &&
                    (card.printedCost ?? 0) > 0 &&
                    context.player.dynastyDeck.length >= (card.printedCost ?? 0),
                cardType: CardType.Character
            }, multipleContext((context) => ({
                gameActions: [
                    discardCard((discardContext) => ({
                        target: discardContext.player.dynastyDeck.slice(0, context.target.printedCost || 0)
                    })),
                    dishonor()
                ]
            })))
            .effect('dishonor {0} and discard the top {1} cards of their dynasty deck', (context) => [context.target.printedCost]);
    }
}
