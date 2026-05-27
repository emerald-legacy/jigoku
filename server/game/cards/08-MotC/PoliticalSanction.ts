import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../basecard.js';
import DrawCard from '../../drawcard.js';
import type Ring from '../../ring.js';
import AbilityDsl from '../../abilitydsl.js';

class PoliticalSanction extends DrawCard {
    static id = 'political-sanction';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cardCannot('triggerAbilities')
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        if(context.game.isDuringConflict('political')) {
            const conflict = this.game.currentConflict;
            if(!conflict) {
                return false;
            }
            const diff = conflict.attackerSkill - conflict.defenderSkill;
            const hasSkillAdvantage = context.player.isAttackingPlayer() ? diff > 0 : diff < 0;
            return hasSkillAdvantage && super.canPlay(context, playType);
        }

        return false;
    }

    canPlayOn(card: BaseCard | Ring) {
        return card instanceof DrawCard && card.isParticipating() && super.canPlayOn(card);
    }
}


export default PoliticalSanction;
