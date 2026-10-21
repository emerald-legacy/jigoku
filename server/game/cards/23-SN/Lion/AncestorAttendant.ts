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
                    card.costAtLeast(1) &&
                    card.costAtMost(context.player.dynastyDeck.length),
                cardType: CardType.Character
            }, multiple((context) => [
                discardCard((discardContext) => ({
                    target: discardContext.player.dynastyDeck.slice(0, context.target.getCost() ?? 0)
                })),
                dishonor()
            ]))
            .chatText((context) => msg`dishonor ${context.chatTarget()} and discard the top ${context.target.getCost()} cards of their dynasty deck`);
    }
}
