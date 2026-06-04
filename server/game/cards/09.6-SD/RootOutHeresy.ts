import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType, EventName, Location } from '../../Constants.js';
import type { GameEvent } from '../../Events/EventPayloads.js';
import AbilityDsl from '../../abilitydsl.js';

class RootOutHeresy extends DrawCard {
    static id = 'root-out-heresy';

    setupCardAbilities() {
        this.action({
            title: 'Discard a card at random from your oppoent\'s hand',
            condition: () => this.game.isDuringConflict('political'),
            gameAction: AbilityDsl.actions.discardAtRandom(context => ({ target: context.player.opponent })),
            then: (context: AbilityContext) => ({
                gameAction: AbilityDsl.actions.selectCard(({
                    activePromptTitle: 'Choose an attacked province',
                    hidePromptIfSingleCard: true,
                    cardType: CardType.Province,
                    location: Location.Provinces,
                    cardCondition: (card: DrawCard) => card.isConflictProvince(),
                    message: '{0} reduces the strength of {1} by {2}',
                    messageArgs: (cards: DrawCard) => [context.player, cards, this.getStrengthModifier(context)],
                    gameAction: AbilityDsl.actions.cardLastingEffect(() => {
                        let amount = this.getStrengthModifier(context);
                        return ({
                            effect: AbilityDsl.effects.modifyProvinceStrength(amount)
                        });
                    })
                }))
            })
        });
    }

    getStrengthModifier(context: AbilityContext) {
        //Find the event
        if(context.events) {
            let event = context.events.find(a => a.name === 'onCardsDiscardedFromHand') as GameEvent<EventName.OnCardsDiscardedFromHand> | undefined;
            if(event) {
                if(event.discardedCards && event.discardedCards.length > 0) {
                    //Grab the first one (this card should only discard one card)
                    let card = event.discardedCards[0] as DrawCard;
                    let cost = card.printedCost ?? 0;

                    return -1 * cost;
                }
            }
        }

        return 0;
    }
}


export default RootOutHeresy;
