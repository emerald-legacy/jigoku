import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType, EventName, Location, ConflictType } from '../../Constants.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect, discardAtRandom } from '../../GameActions/GameActions.js';

class RootOutHeresy extends DrawCard {
    static id = 'root-out-heresy';

    setupCardAbilities() {
        this.conflictAction('Discard a card at random from your opponent\'s hand', { conflictType: ConflictType.Political })
            .gameAction(discardAtRandom())
            .then()
            .selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince(),
                message: '{0} reduces the strength of {1} by {2}',
                messageArgs: (cards) => [context.player, cards, this.getStrengthModifier(context)],
                gameAction: cardLastingEffect(() => ({
                    effect: modifyProvinceStrength(this.getStrengthModifier(context))
                }))
            }));
    }

    /** The printed cost of the card discarded in the step before, as a strength reduction. */
    private getStrengthModifier(context: AbilityContext) {
        const event = context.previousEvents.find((event) => event.is(EventName.OnCardsDiscardedFromHand));
        // this card only discards one card
        const card = event?.discardedCards?.[0];
        if(!card) {
            return 0;
        }
        return -1 * (card.isDrawCard() ? card.printedCost ?? 0 : 0);
    }
}


export default RootOutHeresy;
