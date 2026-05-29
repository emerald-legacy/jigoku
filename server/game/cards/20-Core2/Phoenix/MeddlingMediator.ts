import { Phases, TargetModes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class MeddlingMediator extends DrawCard {
    static id = 'meddling-mediator';

    setupCardAbilities() {
        this.action({
            title: 'Take 1 fate or 1 honor',
            phase: Phases.Conflict,
            condition: (context) =>
                context.player.opponent !== undefined &&
                this.game.getConflicts(context.player.opponent).filter((conflict) => !conflict.passed).length > 1,
            target: {
                mode: TargetModes.Select,
                choices: {
                    'Take 1 fate': AbilityDsl.actions.takeFate(),
                    'Take 1 honor': AbilityDsl.actions.takeHonor()
                }
            }
        });
    }
}
