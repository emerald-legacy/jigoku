import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { cardCannot } from '../../effects.js';
import { RestrictionType, PlayType, RestrictionScope } from '../../Constants.js';

class InHarmony extends DrawCard {
    static id = 'in-harmony';

    setupCardAbilities() {
        this.whileAttached({
            effect: cardCannot({
                cannot: RestrictionType.RemoveFate,
                appliesTo: RestrictionScope.CardAndRingEffects
            })
        });
    }

    canPlay(context: AbilityContext, playType?: PlayType) {
        return context.player.getClaimedRings().length >= 1 && super.canPlay(context, playType);
    }
}


export default InHarmony;
