import DrawCard from '../../DrawCard.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import type { AbilityContext } from '../../AbilityContext.js';

class MatsuKoso extends DrawCard {
    static id = 'matsu-koso';

    setupCardAbilities() {
        this.action('Lower military skill')
            .condition((context) => context.source.isParticipating())
            .gameAction(cardLastingEffect((context) => ({
                target: this.getTargets(context),
                effect: modifyMilitarySkill((card) => -card.printedPoliticalSkill)
            })))
            .effect('lower the military skill of {1} by their respective printed political skill', (context) => [this.getTargets(context)]);
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
