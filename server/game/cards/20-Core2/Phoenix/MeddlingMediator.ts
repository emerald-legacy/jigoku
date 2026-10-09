import { Phase } from '../../../Constants.js';
import { takeFate, takeHonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class MeddlingMediator extends DrawCard {
    static id = 'meddling-mediator';

    setupCardAbilities() {
        this.action('Take 1 fate or 1 honor')
            .condition((context) =>
                context.player.opponent !== undefined &&
                this.game.getConflicts(context.player.opponent).filter((conflict) => !conflict.passed).length > 1)
            .select({}, {
                'Take 1 fate': takeFate(),
                'Take 1 honor': takeHonor()
            })
            .phase(Phase.Conflict);
    }
}
