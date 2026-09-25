import { Phases } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class MeddlingMediator extends DrawCard {
    static id = 'meddling-mediator';

    setupCardAbilities() {
        this.action('Take 1 fate or 1 honor')
            .condition((context) =>
                context.player.opponent !== undefined &&
                this.game.getConflicts(context.player.opponent).filter((conflict) => !conflict.passed).length > 1)
            .select('target', {

            }, {
                'Take 1 fate': AbilityDsl.actions.takeFate(),
                'Take 1 honor': AbilityDsl.actions.takeHonor()
            })
            .phase(Phases.Conflict);
    }
}
