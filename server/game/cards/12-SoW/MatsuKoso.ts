import DrawCard from '../../DrawCard.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { msg } from '../../GameChat.js';

class MatsuKoso extends DrawCard {
    static id = 'matsu-koso';

    setupCardAbilities() {
        this.action('Lower military skill')
            .condition((context) => context.source.isParticipating())
            .gameAction(cardLastingEffect((context) => ({
                target: this.getTargets(context),
                effect: modifyMilitarySkill((card) => -card.printedPoliticalSkill)
            })))
            .effect((context) => msg`lower the military skill of ${this.getTargets(context)} by their respective printed political skill`);
    }

    // A dash or 0 printed political skill would change nothing, and applying the effect
    // anyway triggers reactions to a skill change (Kiss of the Sea).
    private getTargets(context: AbilityContext) {
        return (context.game.currentConflict?.getParticipants() ?? []).filter(
            (card) => card.printedPoliticalSkill > 0
        );
    }
}


export default MatsuKoso;
