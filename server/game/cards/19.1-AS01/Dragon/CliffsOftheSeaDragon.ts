import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { ConflictTypes, Players } from '../../../Constants.js';
import type Player from '../../../player.js';
import { ProvinceCard } from '../../../ProvinceCard.js';

type ConflictRecord = {
    attackingPlayer: Player;
    winner?: Player;
    declaredType: ConflictTypes | string;
    passed: boolean;
    uuid: string;
};

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
