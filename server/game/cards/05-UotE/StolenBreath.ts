import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';

class StolenBreath extends DrawCard {
    static id = 'stolen-breath';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: [
                ability.effects.cannotParticipateAsAttacker('political'),
                ability.effects.cannotParticipateAsDefender('political')
            ]
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        if(this.game.isDuringConflict()) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default StolenBreath;
