import { ConflictType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class DiplomatOfTheSteppes extends DrawCard {
    static id = 'diplomat-of-the-steppes';

    setupCardAbilities() {
        this.action({
            title: 'Change the conflict to military',
            cost: AbilityDsl.costs.payHonor(1),
            condition: (context) => {
                if(!context.source.isParticipating('political')) {
                    return false;
                }
                const conflict = this.game.currentConflict;
                if(!conflict) {
                    return false;
                }
                const diff = conflict.attackerSkill - conflict.defenderSkill;
                return context.player.isAttackingPlayer() ? diff >= 0 : diff <= 0;
            },
            effect: 'switch the conflict type to {1}',
            effectArgs: () => 'military',
            gameAction: AbilityDsl.actions.switchConflictType({ targetConflictType: ConflictType.Military })
        });
    }
}
