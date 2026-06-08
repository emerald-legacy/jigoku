import DrawCard from '../../DrawCard.js';
import { CardType, EventName } from '../../Constants.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class Compass extends DrawCard {
    static id = 'compass';

    setupCardAbilities() {
        this.reaction({
            title: 'Look at top 3 cards of a deck',
            when: {
                onCardRevealed: (event: EventPayload<EventName.OnCardRevealed>, context: TriggeredAbilityContext<this>) =>
                    event.card && event.card.type === CardType.Province && event.card.controller === context.player.opponent &&
                    context.source && context.source.parent && (context.source.parent as DrawCard).isParticipating() &&
                    (context.player.dynastyDeck.length > 0 || context.player.conflictDeck.length > 0)
            },
            effect: 'look at the top 3 cards of one of their decks',
            handler: (context: TriggeredAbilityContext) => {
                let cards: DrawCard[] = [];
                let choices: string[] = [];
                let handlers: (() => void)[] = [];
                if(context.player.dynastyDeck.length > 0) {
                    choices.push('Dynasty Deck');
                    handlers.push(() => {
                        this.game.addMessage('{0} chooses to look at the top 3 cards of their dynasty deck', context.player);
                        cards = context.player.dynastyDeck.slice(0, 3);
                        this.moveToBottomHandler(context, cards, 'dynasty deck');
                    });
                }
                if(context.player.conflictDeck.length > 0) {
                    choices.push('Conflict Deck');
                    handlers.push(() => {
                        this.game.addMessage('{0} chooses to look at the top 3 cards of their conflict deck', context.player);
                        cards = context.player.conflictDeck.slice(0, 3);
                        this.moveToBottomHandler(context, cards, 'conflict deck');
                    });
                }

                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTite: 'Choose a deck',
                    choices: choices,
                    handlers: handlers
                });
            }
        });
    }

    moveToBottomHandler(context: TriggeredAbilityContext, cards: DrawCard[], deck: string) {
        let bottomOfDeck = deck + ' bottom';
        if(cards.length > 0) {
            this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a card to place on the bottom of your deck',
                context: context,
                cards: cards,
                choices: ['Done'],
                handlers: [() => this.moveToTopHandler(context, cards, deck)],
                cardHandler: (card: DrawCard) => {
                    this.game.addMessage('{0} places a card on the bottom of their {1}', context.player, deck);
                    context.player.moveCard(card, bottomOfDeck);
                    cards = cards.filter((c) => c !== card);
                    this.moveToBottomHandler(context, cards, deck);
                }
            });
        } else {
            this.moveToTopHandler(context, cards, deck);
        }
    }

    moveToTopHandler(context: TriggeredAbilityContext, cards: DrawCard[], deck: string) {
        if(cards.length > 1) {
            this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a card to place on the top of your deck',
                context: context,
                cards: cards,
                cardHandler: (card: DrawCard) => {
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
