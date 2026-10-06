import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { draw } from '../../../GameActions/GameActions.js';
import { ConflictType } from '../../../Constants.js';

export default class MomijiHalls extends StrongholdCard {
    static id = 'momiji-halls';

    setupCardAbilities() {
        this.action('Draw 2 cards')
            .cost(AbilityDsl.costs.bowSelf())
            .cost(AbilityDsl.costs.discardCard())
            .condition((context) => context.player.cardsInPlay.some((card) => card.isAttacking(ConflictType.Military)))
            .gameAction(draw({ amount: 2 }));
    }
}
