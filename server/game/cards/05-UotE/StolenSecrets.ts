import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType, Players, RemainingCards } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { setAside } from '../../GameActions/GameActions.js';
import { topCards } from '../topCards.js';

class StolenSecrets extends DrawCard {
    static id = 'stolen-secrets';

    override setupCardAbilities() {
        this.action('Steal one of opponent\'s top 4 cards')
            .condition((context) => this.game.isDuringConflict(ConflictType.Political) && !!context.player.opponent && context.player.opponent.conflictDeck.length > 0)
            .cost(costs.removeFate({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }))
            .deckSearch((context) => ({
                activePromptTitle: 'Choose a card to remove from the game',
                target: context.player.opponent,
                player: Players.Self,
                cardsToLookAt: 4,
                remainingCards: RemainingCards.TopAnyOrder,
                selectedCardsHandler: (context, _event, [card]) => card && this.stealCard(card, context)
            }))
            .chatText((context) => {
                const inDeck = context.player.opponent?.conflictDeck.length ?? 0;
                return msg`look at the ${topCards(4, inDeck)} of ${context.player.opponent}'s conflict deck and remove ${inDeck === 1 ? 'it' : 'one'} from the game`;
            });
    }

    private stealCard(card: DrawCard, context: AbilityContext) {
        setAside({ hidden: true, playableBy: context.player }).resolve(card, context);
    }
}


export default StolenSecrets;
