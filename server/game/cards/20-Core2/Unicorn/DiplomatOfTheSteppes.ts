import { msg } from '../../../GameChat.js';
import { ConflictType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import DrawCard from '../../../DrawCard.js';

export default class DiplomatOfTheSteppes extends DrawCard {
    static id = 'diplomat-of-the-steppes';

    override setupCardAbilities() {
        this.conflictAction('Change the conflict to military', { conflictType: ConflictType.Political })
            .ifCondition((context) => {
                const conflict = this.game.currentConflict;
                if(!conflict) {
                    return false;
                }
                const diff = conflict.attackerSkill - conflict.defenderSkill;
                return context.player.isAttackingPlayer() ? diff >= 0 : diff <= 0;
            })
            .cost(costs.payHonor(1))
            .switchConflictType({ targetConflictType: ConflictType.Military })
            .chatText(() => msg`switch the conflict type to ${'military'}`);
    }
}
