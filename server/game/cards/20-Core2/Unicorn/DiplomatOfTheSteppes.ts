import { ConflictType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { switchConflictType } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DiplomatOfTheSteppes extends DrawCard {
    static id = 'diplomat-of-the-steppes';

    setupCardAbilities() {
        this.conflictAction('Change the conflict to military', { conflictType: ConflictType.Political })
            .cost(costs.payHonor(1))
            .condition((context) => {
                const conflict = this.game.currentConflict;
                if(!conflict) {
                    return false;
                }
                const diff = conflict.attackerSkill - conflict.defenderSkill;
                return context.player.isAttackingPlayer() ? diff >= 0 : diff <= 0;
            })
            .gameAction(switchConflictType({ targetConflictType: ConflictType.Military }))
            .chatText('switch the conflict type to {1}', () => 'military');
    }
}
