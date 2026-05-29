import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class KakitaAsami extends DrawCard {
    static id = 'kakita-asami';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action ({
            title: 'Take one honor from your opponent',
            condition: (context: any) => {
                if(!this.game.isDuringConflict('political') || !this.game.currentConflict) {
                    return false;
                }
                let diff = this.game.currentConflict.attackerSkill - this.game.currentConflict.defenderSkill;
                return context.player.isAttackingPlayer() ? diff > 0 : diff < 0;
            },
            gameAction: ability.actions.takeHonor()
        });
    }
}


export default KakitaAsami;
