import { ConflictType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

class KakitaAsami extends DrawCard {
    static id = 'kakita-asami';

    override setupCardAbilities() {
        this.action('Take one honor from your opponent')
            .condition((context) => context.source.isParticipating(ConflictType.Political))
            .ifCondition((context) => {
                const conflict = context.game.currentConflict;
                if(!conflict) {
                    return false;
                }
                const diff = conflict.attackerSkill - conflict.defenderSkill;
                return context.player.isAttackingPlayer() ? diff > 0 : diff < 0;
            })
            .takeHonor();
    }
}


export default KakitaAsami;
