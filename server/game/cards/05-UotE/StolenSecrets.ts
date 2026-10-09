import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType, ConflictType, RemainingCards, TargetMode } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { canPlayFromOwn, hideWhenFaceUp } from '../../effects.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { deckSearch } from '../../GameActions/GameActions.js';

class StolenSecrets extends DrawCard {
    static id = 'stolen-secrets';

    setupCardAbilities() {
        this.action('Steal one of opponent\'s top 4 cards')
            .cost(costs.removeFate({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }))
            .condition((context) => this.game.isDuringConflict(ConflictType.Political) && !!context.player.opponent && context.player.opponent.conflictDeck.length > 0)
            .gameAction(deckSearch((context) => ({
                activePromptTitle: 'Choose a card to remove from the game',
                player: context.player.opponent,
                choosingPlayer: context.player,
                cardsToLookAt: 4,
                mode: TargetMode.Exactly,
                numCards: 1,
                remainingCards: RemainingCards.TopAnyOrder,
                selectedCardsHandler: (context, _event, [card]) => card && this.stealCard(card, context)
            })))
            .chatText((context) => msg`look at the top 4 cards of ${context.player.opponent}'s conflict deck and remove one from the game`);
    }

    private stealCard(card: DrawCard, context: AbilityContext) {
        card.owner.removeCardFromPile(card);
        card.controller = context.player;
        card.moveTo(Location.RemovedFromGame);
        context.player.removedFromGame.unshift(card);
        context.source.lastingEffect({
            until: {
                onCardMoved: (event) => event.card === card && event.originalLocation === Location.RemovedFromGame
            },
            match: card,
            effect: [
                hideWhenFaceUp(),
                canPlayFromOwn(Location.RemovedFromGame, [card], this)
            ]
        });
        this.game.checkGameState();
    }
}


export default StolenSecrets;
