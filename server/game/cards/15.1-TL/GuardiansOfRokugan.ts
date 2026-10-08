import { msg } from '../../GameChat.js';
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
            .chatText((context) => msg`look at the top ${context.game.currentConflict?.skillDifference ?? 0} cards of their deck for a character costing ${context.game.currentConflict?.skillDifference ?? 0} or less to put into play`);
    }
}


export default GuardiansOfRokugan;
