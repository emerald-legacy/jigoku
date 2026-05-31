import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import type { ConflictRecord } from '../../../ConflictTracker.js';

export default class CliffsOfTheSeaDragon extends ProvinceCard {
    static id = 'cliffs-of-the-sea-dragon';

    public setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            condition: (context) =>
                !context.game.conflictRecord.some((conflict) => this.isTurnedOff(context, conflict)),
            effect: AbilityDsl.effects.playerCannot('takeFateFromRings')
        });
    }

    private isTurnedOff(context: AbilityContext, conflict: ConflictRecord) {
        const lostByDragon = conflict.winner === context.source.controller.opponent;
        const passedByAnyone = conflict.passed;
        return lostByDragon || passedByAnyone;
    }
}
