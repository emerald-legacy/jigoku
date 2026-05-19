import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class PoliticalSanction extends DrawCard {
    static id = 'political-sanction';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cardCannot('triggerAbilities')
        });
    }

    canPlay(context, playType) {
        if(context.game.isDuringConflict('political')) {
            let diff = this.game.currentConflict.attackerSkill - this.game.currentConflict.defenderSkill;
            const hasSkillAdvantage = context.player.isAttackingPlayer() ? diff > 0 : diff < 0;
            return hasSkillAdvantage && super.canPlay(context, playType);
        }

        return false;
    }

    canPlayOn(card) {
        return card.isParticipating() && super.canPlayOn(card);
    }
}


export default PoliticalSanction;
