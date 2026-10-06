import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { cardCannot } from '../../effects.js';

class InHarmony extends DrawCard {
    static id = 'in-harmony';

    setupCardAbilities() {
        this.whileAttached({
            effect: cardCannot({
                cannot: 'removeFate',
                restricts: 'cardAndRingEffects'
            })
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        return context.player.getClaimedRings().length >= 1 && super.canPlay(context, playType);
    }
}


export default InHarmony;
