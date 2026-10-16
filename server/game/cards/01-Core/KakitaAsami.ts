import { ConflictType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

class KakitaAsami extends DrawCard {
    static id = 'kakita-asami';

    override setupCardAbilities() {
        this.action('Take one honor from your opponent')
            .condition((context) => {
                if(!context.source.isParticipating(ConflictType.Political) || !context.game.currentConflict) {
                    return false;
                }
                const diff = context.game.currentConflict.attackerSkill - context.game.currentConflict.defenderSkill;
                return context.player.isAttackingPlayer() ? diff > 0 : diff < 0;
            })
            .takeHonor();
    }
}


export default KakitaAsami;
