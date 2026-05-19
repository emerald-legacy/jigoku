import DrawCard from '../../drawcard.js';
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
            gameAction: AbilityDsl.actions.deckSearch(() => ({
                activePromptTitle: 'Select a character to put into play',
                amount: context => context.game.currentConflict.skillDifference,
                deck: Decks.DynastyDeck,
                cardCondition: (card, context) => card.type === CardTypes.Character && AbilityDsl.actions.putIntoPlay().canAffect(card, context) && card.costLessThan(context.game.currentConflict.skillDifference + 1),
                gameAction: AbilityDsl.actions.putIntoPlay(),
                shuffle: context => context.game.currentConflict.skillDifference >= context.player.dynastyDeck.length
            })),
            effect: 'look at the top {1} cards of their deck for a character costing {1} or less to put into play',
            effectArgs: context => [context.game.currentConflict.skillDifference]
        });
    }
}


export default GuardiansOfRokugan;
