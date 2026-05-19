import DrawCard from '../../drawcard.js';

class KakitaAsami extends DrawCard {
    static id = 'kakita-asami';

    setupCardAbilities(ability) {
        this.action ({
            title: 'Take one honor from your opponent',
            condition: context => {
                if(!this.game.isDuringConflict('political')) {
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
