import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import type Ring from '../../Ring.js';
import { cannotTriggerAbilities } from '../../effects.js';
import { ConflictType } from '../../Constants.js';

class PoliticalSanction extends DrawCard {
    static id = 'political-sanction';

    override setupCardAbilities() {
        this.playOnlyIf((context) => {
            const conflict = context.game.currentConflict;
            if(!conflict || !context.game.isDuringConflict(ConflictType.Political)) {
                return false;
            }
            const diff = conflict.attackerSkill - conflict.defenderSkill;
            return context.player.isAttackingPlayer() ? diff > 0 : diff < 0;
        });

        this.whileAttached({
            effect: cannotTriggerAbilities()
        });
    }

    override canPlayOn(card: BaseCard | Ring) {
        return card.isCard() && card.isDrawCard() && card.isParticipating() && super.canPlayOn(card);
    }
}


export default PoliticalSanction;
