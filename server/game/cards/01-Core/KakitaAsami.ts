import { ConflictType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

class KakitaAsami extends DrawCard {
    static id = 'kakita-asami';

    override setupCardAbilities() {
        this.action('Take one honor from your opponent')
            .condition((context) => context.source.isParticipating(ConflictType.Political))
            .ifCondition((context) => {
                const conflict = context.game.currentConflict;
                const opponent = context.player.opponent;
                return !!conflict && !!opponent &&
                    conflict.getCurrentSkill(context.player, ConflictType.Political) > conflict.getCurrentSkill(opponent, ConflictType.Political);
            })
            .takeHonor();
    }
}


export default KakitaAsami;
