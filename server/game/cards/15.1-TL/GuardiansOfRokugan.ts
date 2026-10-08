import DrawCard from '../../DrawCard.js';
import { putIntoPlay } from '../../GameActions/GameActions.js';
import { CardType, DeckType } from '../../Constants.js';

class GuardiansOfRokugan extends DrawCard {
    static id = 'guardians-of-rokugan';

    setupCardAbilities() {
        this.reaction('Put a character into play')
            .when({
                afterConflict: (event, context) => context.player.isDefendingPlayer() && event.conflict.winner === context.player
            })
            .deckSearch({
                activePromptTitle: 'Select a character to put into play',
                cardsToLookAt: (ctx) => ctx.game.currentConflict?.skillDifference ?? 0,
                deck: DeckType.Dynasty,
                cardCondition: (card, ctx) => card.type === CardType.Character && putIntoPlay().canAffect(card, ctx) && card.costLessThan((ctx.game.currentConflict?.skillDifference ?? 0) + 1),
                gameAction: putIntoPlay(),
                shuffle: (ctx) => (ctx.game.currentConflict?.skillDifference ?? 0) >= ctx.player.dynastyDeck.length
            })
            .chatText('look at the top {1} cards of their deck for a character costing {1} or less to put into play', (context) => [context.game.currentConflict?.skillDifference ?? 0]);
    }
}


export default GuardiansOfRokugan;
