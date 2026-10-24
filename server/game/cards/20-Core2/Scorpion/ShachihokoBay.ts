import type { AbilityContext } from '../../../AbilityContext.js';
import { Players, RemainingCards, TargetMode } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import type DrawCard from '../../../DrawCard.js';
import { rearrangeDeck, setAside } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';

export default class ShachihokoBay extends ProvinceCard {
    static id = 'shachihoko-bay';

    override setupCardAbilities() {
        this.interrupt('Look at the top 6 cards of the attacker\'s deck and steal up to 3 of them')
            .when({
                onBreakProvince: (event, context) =>
                    event.card === context.source && !!context.game.currentConflict
            })
            .deckSearch((context) => ({
                activePromptTitle: 'Select up to 3 cards to take',
                target: context.game.currentConflict?.attackingPlayer,
                player: Players.Self,
                cardsToLookAt: 6,
                mode: TargetMode.UpTo,
                numCards: 3,
                remainingCards: RemainingCards.TopAnyOrder,
                selectedCardsHandler: (context, _event, cards) => this.steal(context, cards),
                remainingCardsHandler: (context, _event, cards) => this.returnToTop(context, cards)
            }));
    }

    private steal(context: AbilityContext, cards: DrawCard[]): void {
        setAside({
            target: cards,
            playableBy: context.player,
            message: (context, cards) => msg`${context.player} takes ${cards} from ${context.game.currentConflict?.attackingPlayer}'s deck`
        }).resolve(cards, context);
    }

    private returnToTop(context: AbilityContext, cards: DrawCard[]): void {
        const attacker = context.game.currentConflict?.attackingPlayer;
        if(cards.length === 0 || !attacker) {
            return;
        }
        rearrangeDeck({
            cards,
            message: (context, ordered) => msg`${context.player} returns ${ordered.length} cards to the top of ${attacker}'s deck`
        }).resolve(attacker, context);
    }
}
