import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import type Ring from '../../Ring.js';
import AbilityDsl from '../../abilitydsl.js';

class PoliticalSanction extends DrawCard {
    static id = 'political-sanction';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cannotTriggerAbilities()
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
