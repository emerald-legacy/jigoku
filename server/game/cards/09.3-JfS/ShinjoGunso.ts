import { PlayType, Decks, CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type { Event } from '../../Events/Event.js';

export default class ShinjoGunso extends DrawCard {
    static id = 'shinjo-gunso';

    setupCardAbilities() {
        this.reaction({
            title: 'Put a character into play',
            when: {
                onCardPlayed: (event, context) =>
                    event.playType === PlayType.PlayFromProvince &&
                    event.card === context.source &&
                    !!event.originalLocation &&
                    context.game.getProvinceArray().includes(event.originalLocation)
            },
            effect: 'search the top 5 cards of their dynasty deck for a character that costs 2 or less and put it into play',
            gameAction: AbilityDsl.actions.sequentialContext((context) => {
                const topFive = context.player.dynastyDeck.slice(0, 5);
                return {
                    gameActions: [
                        AbilityDsl.actions.deckSearch(() => ({
                            activePromptTitle: 'Choose a character to put into play',
                            amount: 5,
                            deck: Decks.DynastyDeck,
                            cardCondition: (card) => card.type === CardType.Character && card.printedCost !== null && card.printedCost <= 2,
                            message: '{0} puts {1} into play{2}{3}',
                            shuffle: false,
                            messageArgs: (context, cards) => {
                                const discards = topFive.filter((a: DrawCard) => !cards.includes(a));
                                const card = cards.length > 0 ? cards : 'nothing';
                                return [context.player, card, discards.length > 0 ? ' and discards ' : '', discards];
                            },
                            gameAction: AbilityDsl.actions.putIntoPlay()
                        })),
                        AbilityDsl.actions.moveCard((context2) => ({
                            target: topFive.filter((a: DrawCard) => {
                                const events = context2.events.filter((a: Event) => a.name === 'onDeckSearch' && !a.cancelled);
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
            })
        });
    }
}
