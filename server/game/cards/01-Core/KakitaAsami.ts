import DrawCard from '../../DrawCard.js';

class KakitaAsami extends DrawCard {
    static id = 'kakita-asami';

    setupCardAbilities() {
        this.conflictAction('Take one honor from your opponent', { conflictType: 'political' })
            .condition((context) => {
                if(!context.game.currentConflict) {
                    return false;
                }
                const diff = context.game.currentConflict.attackerSkill - context.game.currentConflict.defenderSkill;
                return context.player.isAttackingPlayer() ? diff > 0 : diff < 0;
            })
            .takeHonor();
    }
}


export default KakitaAsami;
