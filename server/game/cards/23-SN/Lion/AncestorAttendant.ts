import { msg } from '../../../GameChat.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { discardCard, dishonor, multiple } from '../../../GameActions/GameActions.js';

export default class AncestorAttendant extends DrawCard {
    static id = 'ancestor-attendant';

    override setupCardAbilities() {
        this.conflictAction('Dishonor a character')
            .target({
                cardCondition: (card, context) => !!context.player.opponent &&
                    card.isParticipatingFor(context.player.opponent) &&
                    (card.printedCost ?? 0) > 0 &&
                    context.player.dynastyDeck.length >= (card.printedCost ?? 0),
                cardType: CardType.Character
            }, multiple((context) => [
                discardCard((discardContext) => ({
                    target: discardContext.player.dynastyDeck.slice(0, context.target.printedCost || 0)
                })),
                dishonor()
            ]))
            .chatText((context) => msg`dishonor ${context.chatTarget()} and discard the top ${context.target.printedCost} cards of their dynasty deck`);
    }
}
