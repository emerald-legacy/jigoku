import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

class Compass extends DrawCard {
    static id = 'compass';

    setupCardAbilities() {
        this.reaction('Look at top 3 cards of a deck')
            .when({
                onCardRevealed: (event, context) =>
                    event.card && event.card.type === CardType.Province && event.card.controller === context.player.opponent &&
                    context.source && context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                    (context.player.dynastyDeck.length > 0 || context.player.conflictDeck.length > 0)
            })
            .handler((context) => {
                const decks = [
                    { text: 'Dynasty Deck', location: Location.DynastyDeck },
                    { text: 'Conflict Deck', location: Location.ConflictDeck }
                ] as const;
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a deck',
                    options: decks
                        .filter(({ location }) => context.player.getSourceList(location).length > 0)
                        .map(({ text, location }) => ({
                            text,
                            handler: () => {
                                this.game.addMessage('{0} chooses to look at the top 3 cards of their {1}', context.player, location);
                                this.moveToBottomHandler(context, context.player.getSourceList(location).slice(0, 3), location);
                            }
                        }))
                });
            })
            .effect('look at the top 3 cards of one of their decks');
    }

    private moveToBottomHandler(context: TriggeredAbilityContext, cards: DrawCard[], deck: Location) {
        if(cards.length > 0) {
            this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a card to place on the bottom of your deck',
                context: context,
                cards: cards,
                options: [{ text: 'Done', handler: () => this.moveToTopHandler(context, cards, deck) }],
                cardHandler: (card) => {
                    this.game.addMessage('{0} places a card on the bottom of their {1}', context.player, deck);
                    context.player.moveCard(card, deck, { bottom: true });
                    cards = cards.filter((c) => c !== card);
                    this.moveToBottomHandler(context, cards, deck);
                }
            });
        } else {
            this.moveToTopHandler(context, cards, deck);
        }
    }

    private moveToTopHandler(context: TriggeredAbilityContext, cards: DrawCard[], deck: Location) {
        if(cards.length > 1) {
            this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a card to place on the top of your deck',
                context: context,
                cards: cards,
                cardHandler: (card) => {
                    this.game.addMessage('{0} places a card on the top of their {1}', context.player, deck);
                    context.player.moveCard(card, deck);
                    cards = cards.filter((c) => c !== card);
                    this.moveToTopHandler(context, cards, deck);
                }
            });
        } else if(cards.length === 1) {
            context.player.moveCard(cards[0], deck);
        }
    }
}


export default Compass;
