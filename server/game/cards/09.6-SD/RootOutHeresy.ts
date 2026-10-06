import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType, EventName, Location, ConflictType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class RootOutHeresy extends DrawCard {
    static id = 'root-out-heresy';

    setupCardAbilities() {
        this.conflictAction('Discard a card at random from your opponent\'s hand', { conflictType: ConflictType.Political })
            .gameAction(AbilityDsl.actions.discardAtRandom())
            .then((context) => ({
                gameAction: AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose an attacked province',
                    hidePromptIfSingleCard: true,
                    cardType: CardType.Province,
                    location: Location.Provinces,
                    cardCondition: (card) => card.isConflictProvince(),
                    message: '{0} reduces the strength of {1} by {2}',
                    messageArgs: (cards) => [context.player, cards, this.getStrengthModifier(context)],
                    gameAction: AbilityDsl.actions.cardLastingEffect(() => {
                        const amount = this.getStrengthModifier(context);
                        return ({
                            effect: AbilityDsl.effects.modifyProvinceStrength(amount)
                        });
                    })
                })
            }));
    }

    private getStrengthModifier(context: AbilityContext) {
        const event = context.events.find((event) => event.is(EventName.OnCardsDiscardedFromHand));
        // this card only discards one card
        const card = event?.discardedCards?.[0];
        if(!card) {
            return 0;
        }
        return -1 * (card.isDrawCard() ? card.printedCost ?? 0 : 0);
    }
}


export default RootOutHeresy;
