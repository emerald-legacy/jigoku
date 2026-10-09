import { msg } from '../../GameChat.js';
import { PlayType, DeckType, CardType, EventName, Location, RemainingCards } from '../../Constants.js';
import { deckSearch, moveCard, putIntoPlay, sequentialContext } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import type { Event } from '../../Events/Event.js';
import type { GameEvent } from '../../Events/EventPayloads.js';

export default class ShinjoGunso extends DrawCard {
    static id = 'shinjo-gunso';

    setupCardAbilities() {
        this.reaction('Put a character into play')
            .when({
                onCardPlayed: (event, context) =>
                    event.playType === PlayType.PlayFromProvince &&
                    event.card === context.source &&
                    !!event.originalLocation &&
                    context.game.getProvinceArray().some((location) => location === event.originalLocation)
            })
            .gameAction(sequentialContext((context) => {
                const topFive = context.player.dynastyDeck.slice(0, 5);
                return {
                    gameActions: [
                        deckSearch(() => ({
                            activePromptTitle: 'Choose a character to put into play',
                            cardsToLookAt: 5,
                            deck: DeckType.Dynasty,
                            cardCondition: (card) => card.type === CardType.Character && card.printedCost !== null && card.printedCost <= 2,
                            remainingCards: RemainingCards.Top,
                            message: (context, cards) => {
                                const discards = topFive.filter((a) => !cards.includes(a));
                                return discards.length > 0
                                    ? msg`${context.player} puts ${cards} into play and discards ${discards}`
                                    : msg`${context.player} puts ${cards} into play`;
                            },
                            gameAction: putIntoPlay()
                        })),
                        moveCard((context2) => ({
                            target: topFive.filter((a) => {
                                const events = context2.events.filter((a: Event): a is GameEvent<EventName.OnDeckSearch> => a.name === EventName.OnDeckSearch && !a.cancelled);
                                if(events.length > 0 && events[0].selectedCards) {
                                    return !events[0].selectedCards.includes(a);
                                }
                                return true;
                            }),
                            faceup: true,
                            destination: Location.DynastyDiscardPile
                        }))
                    ]
                };
            }))
            .chatText('search the top 5 cards of their dynasty deck for a character that costs 2 or less and put it into play');
    }
}
