import { StrongholdCard } from '../../../StrongholdCard.js';
import * as costs from '../../../costs/index.js';
import { ConflictType } from '../../../Constants.js';

export default class MomijiHalls extends StrongholdCard {
    static id = 'momiji-halls';

    override setupCardAbilities() {
        this.action('Draw 2 cards')
            .ifCondition((context) => context.player.cardsInPlay.some((card) => card.isAttacking(ConflictType.Military)))
            .cost(costs.bowSelf())
            .cost(costs.discardCard())
            .draw(2);
    }
}
