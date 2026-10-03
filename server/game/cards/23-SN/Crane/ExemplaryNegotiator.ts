import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class ExemplaryNegotiator extends DrawCard {
    static id = 'exemplary-negotiator';

    setupCardAbilities() {
        this.action('Discard cards to cause opponent to discard')
            .cost(AbilityDsl.costs.discardCardsUpToVariableX(() => 2))
            .condition(context => context.player.anyCardsInPlay(card => card.isDishonored))
            .gameAction(AbilityDsl.actions.discardAtRandom(context => ({
                amount: context.costs.discardCardsUpToVariableX?.length || 1,
                target: context.player.opponent
            })))
            .effect('discard {1} to make {2} discard {3} card{4} at random', (context) => [
                context.costs.discardCardsUpToVariableX,
                context.player.opponent,
                (context.costs.discardCardsUpToVariableX ?? []).length,
                (context.costs.discardCardsUpToVariableX ?? []).length > 1 ? 's' : ''
            ]);
    }
}
