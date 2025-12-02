import { ConflictTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class DiplomatOfTheSteppes extends DrawCard {
    static id = 'diplomat-of-the-steppes';

    setupCardAbilities() {
        this.action({
            title: 'Change the conflict to military',
            cost: AbilityDsl.costs.payHonor(1),
            condition: (context) => {
                if (!(context.source as DrawCard).isParticipating('political')) {
                    return false;
                }
                let diff = this.game.currentConflict.attackerSkill - this.game.currentConflict.defenderSkill;
                return context.player.isAttackingPlayer() ? diff >= 0 : diff <= 0;
            },
            effect: 'switch the conflict type to {1}',
            effectArgs: () => 'military',
            gameAction: AbilityDsl.actions.switchConflictType({ targetConflictType: ConflictTypes.Military })
        });
    }
}
