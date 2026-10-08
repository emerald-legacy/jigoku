import { CardType, DeckType, Location, EventName } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { deckSearch, moveCard, putIntoPlay, sequentialContext } from '../../../GameActions/GameActions.js';

export default class VisitTheKhubiSquare extends ProvinceCard {
    static id = 'visit-the-khubi-square';

    setupCardAbilities() {
        this.reaction('Put a character into play')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .gameAction(sequentialContext((context) => {
                const topFive = context.player.dynastyDeck.slice(0, 5);
                return {
                    gameActions: [
                        deckSearch({
                            activePromptTitle: 'Choose a character to put into play',
                            cardsToLookAt: 5,
                            deck: DeckType.Dynasty,
                            cardCondition: (card) => card.type === CardType.Character && card.printedCost !== null && card.printedCost <= 2,
                            message: '{0} puts {1} into play{2}{3}',
                            shuffle: false,
                            messageArgs: (context, cards) => {
                                const discards = topFive.filter((a) => !cards.includes(a));
                                const card = cards.length > 0 ? cards : 'nothing';
                                return [context.player, card, discards.length > 0 ? ' and discards ' : '', discards];
                            },
                            gameAction: putIntoPlay()
                        }),
                        moveCard((context2) => ({
                            target: topFive.filter((a) => {
                                const searchEvent = context2.events
                                    .filter((event) => !event.cancelled)
                                    .find((event) => event.is(EventName.OnDeckSearch));
                                if(searchEvent && searchEvent.selectedCards) {
                                    return !searchEvent.selectedCards.includes(a);
                                }
                                return true;
                            }),
                            faceup: true,
                            destination: Location.DynastyDiscardPile
                        }))
                    ]
                };
            }))
            .effect('search the top 5 cards of their dynasty deck for a character that costs 2 or less and put it into play');
    }
}
