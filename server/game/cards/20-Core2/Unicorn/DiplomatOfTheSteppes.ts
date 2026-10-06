import { ConflictType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { switchConflictType } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DiplomatOfTheSteppes extends DrawCard {
    static id = 'diplomat-of-the-steppes';

    setupCardAbilities() {
        this.conflictAction('Change the conflict to military', { conflictType: ConflictType.Political })
            .cost(AbilityDsl.costs.payHonor(1))
            .condition((context) => {
                const conflict = this.game.currentConflict;
                if(!conflict) {
                    return false;
                }
                const diff = conflict.attackerSkill - conflict.defenderSkill;
                return context.player.isAttackingPlayer() ? diff >= 0 : diff <= 0;
            })
            .gameAction(switchConflictType({ targetConflictType: ConflictType.Military }))
            .effect('switch the conflict type to {1}', () => 'military');
    }
}
