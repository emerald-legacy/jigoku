import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class AncestorAttendant extends DrawCard {
    static id = 'ancestor-attendant';

    setupCardAbilities() {
        this.conflictAction('Dishonor a character')
            .target('target', {
                cardCondition: (card, context) => !!context.player.opponent &&
                    card.isParticipatingFor(context.player.opponent) &&
                    (card.printedCost ?? 0) > 0 &&
                    context.player.dynastyDeck.length >= (card.printedCost ?? 0),
                cardType: CardType.Character
            }, AbilityDsl.actions.multipleContext((context) => ({
                gameActions: [
                    AbilityDsl.actions.discardCard((discardContext) => ({
                        target: discardContext.player.dynastyDeck.slice(0, context.target.printedCost || 0)
                    })),
                    AbilityDsl.actions.dishonor()
                ]
            })))
            .effect('dishonor {0} and discard the top {1} cards of their dynasty deck', (context) => [context.target?.printedCost]);
    }
}
