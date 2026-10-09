import type { AbilityContext } from '../../../AbilityContext.js';
import { Location, RemainingCards, TargetMode } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { canPlayFromOwn } from '../../../effects.js';
import type DrawCard from '../../../DrawCard.js';
import { deckSearch, rearrangeDeck } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';

export default class ShachihokoBay extends ProvinceCard {
    static id = 'shachihoko-bay';

    setupCardAbilities() {
        this.interrupt('Look at the top 6 cards of the attacker\'s deck and steal up to 3 of them')
            .when({
                onBreakProvince: (event, context) =>
                    event.card === context.source && context.game.currentConflict && Boolean(context.player.opponent)
            })
            .gameAction(deckSearch((context) => ({
                activePromptTitle: 'Select up to 3 cards to take',
                player: context.player.opponent,
                choosingPlayer: context.player,
                cardsToLookAt: 6,
                mode: TargetMode.UpTo,
                numCards: 3,
                remainingCards: RemainingCards.TopAnyOrder,
                selectedCardsHandler: (context, _event, cards) => this.steal(context, cards),
                remainingCardsHandler: (context, _event, cards) => this.returnToTop(context, cards)
            })));
    }

    private steal(context: AbilityContext, cards: DrawCard[]): void {
        if(cards.length === 0) {
            return;
        }
        this.game.addMessage(msg`${context.player} takes ${cards} from ${context.player.opponent}'s deck`);
        for(const card of cards) {
            context.player.moveCard(card, Location.RemovedFromGame);
            card.controller = context.player;
            context.source.lastingEffect({
                until: {
                    onCardMoved: (event) => event.card === card && event.originalLocation === Location.RemovedFromGame
                },
                match: card,
                effect: [canPlayFromOwn(Location.RemovedFromGame, [card], context.source)]
            });
        }
    }

    /** Like `RemainingCards.TopAnyOrder`, with a chat line. */
    private returnToTop(context: AbilityContext, cards: DrawCard[]): void {
        const opponent = context.player.opponent;
        if(cards.length === 0 || !opponent) {
            return;
        }
        rearrangeDeck({
            cards,
            message: (context, ordered) => msg`${context.player} returns ${ordered.length} cards to the top of ${opponent}'s deck`
        }).resolve(opponent, context);
    }
}
