import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Decks } from '../../Constants.js';

class GuardiansOfRokugan extends DrawCard {
    static id = 'guardians-of-rokugan';

    setupCardAbilities() {
        this.reaction({
            title: 'Put a character into play',
            when: {
                afterConflict: (event, context) => context.player.isDefendingPlayer() && event.conflict.winner === context.player
            },
            gameAction: AbilityDsl.actions.deckSearch((_context) => ({
                activePromptTitle: 'Select a character to put into play',
                amount: (ctx) => ctx.game.currentConflict?.skillDifference ?? 0,
                deck: Decks.DynastyDeck,
                cardCondition: (card: any, ctx: any) => card.type === CardTypes.Character && AbilityDsl.actions.putIntoPlay().canAffect(card, ctx) && card.costLessThan((ctx.game.currentConflict?.skillDifference ?? 0) + 1),
                gameAction: AbilityDsl.actions.putIntoPlay(),
                shuffle: (ctx) => (ctx.game.currentConflict?.skillDifference ?? 0) >= ctx.player.dynastyDeck.length
            })),
            effect: 'look at the top {1} cards of their deck for a character costing {1} or less to put into play',
            effectArgs: (context) => [context.game.currentConflict?.skillDifference ?? 0]
        });
    }
}


export default GuardiansOfRokugan;
