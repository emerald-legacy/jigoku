import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import * as costs from '../../../costs/index.js';
import { discardAtRandom } from '../../../GameActions/GameActions.js';

export default class ExemplaryNegotiator extends DrawCard {
    static id = 'exemplary-negotiator';

    setupCardAbilities() {
        this.action('Discard cards to cause opponent to discard')
            .cost(costs.discardCardsUpToVariableX(() => 2))
            .condition((context) => context.player.anyCardsInPlay((card) => card.isDishonored))
            .gameAction(discardAtRandom((context) => ({
                amount: context.costs.discardCardsUpToVariableX?.length || 1
            })))
            .chatText((context) => msg`discard ${context.costs.discardCardsUpToVariableX} to make ${context.player.opponent} discard ${(context.costs.discardCardsUpToVariableX ?? []).length} card${(context.costs.discardCardsUpToVariableX ?? []).length > 1 ? 's' : ''} at random`);
    }
}
