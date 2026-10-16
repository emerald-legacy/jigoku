import { Phase } from '../../../Constants.js';
import { takeFate, takeHonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class MeddlingMediator extends DrawCard {
    static id = 'meddling-mediator';

    override setupCardAbilities() {
        this.action('Take 1 fate or 1 honor')
            .condition((context) =>
                context.player.opponent !== undefined &&
                this.game.getDeclaredConflictCount(context.player.opponent) > 1)
            .phase(Phase.Conflict)
            .select({
                'Take 1 fate': takeFate(),
                'Take 1 honor': takeHonor()
            });
    }
}
