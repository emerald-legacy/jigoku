import DrawCard from '../../DrawCard.js';
import { Location, CardType, ConflictType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { canPlayFromOwn, hideWhenFaceUp } from '../../effects.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { rearrangeDeck } from '../../GameActions/GameActions.js';

class StolenSecrets extends DrawCard {
    static id = 'stolen-secrets';

    setupCardAbilities() {
        this.action('Steal one of opponent\'s top 4 cards')
            .cost(costs.removeFate({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }))
            .condition((context) => this.game.isDuringConflict(ConflictType.Political) && !!context.player.opponent && context.player.opponent.conflictDeck.length > 0)
            .handler((context) => {
                const opponent = context.player.opponent;
                if(!opponent) {
                    return;
                }
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a card to remove from the game',
                    context: context,
                    cards: opponent.conflictDeck.slice(0, 4),
                    cardHandler: (card) => this.stealCard(card, opponent.conflictDeck.slice(0, 4).filter((c) => c !== card), context)
                });
            })
            .effect('look at the top 4 cards of {1}\'s conflict deck and remove one from the game', (context) => context.player.opponent);
    }

    private stealCard(card: DrawCard, remainingCards: DrawCard[], context: AbilityContext) {
        card.owner.removeCardFromPile(card);
        card.controller = context.player;
        card.moveTo(Location.RemovedFromGame);
        context.player.removedFromGame.unshift(card);
        context.source.lastingEffect({
            until: {
                onCardMoved: event => event.card === card && event.originalLocation === Location.RemovedFromGame
            },
            match: card,
            effect: [
                hideWhenFaceUp(),
                canPlayFromOwn(Location.RemovedFromGame, [card], this)
            ]
        });
        this.game.checkGameState();
        if(remainingCards.length > 1 && context.player.opponent) {
            rearrangeDeck({ amount: remainingCards.length }).resolve(context.player.opponent, context);
        }
    }
}


export default StolenSecrets;
