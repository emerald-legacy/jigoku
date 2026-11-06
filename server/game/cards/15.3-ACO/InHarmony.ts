import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { RestrictionType, RestrictionScope } from '../../Constants.js';

class InHarmony extends DrawCard {
    static id = 'in-harmony';

    override setupCardAbilities() {
        this.playOnlyIf((context) => context.player.getClaimedRings().length >= 1);

        this.whileAttached({
            effect: cardCannot({
                cannot: RestrictionType.RemoveFate,
                appliesTo: RestrictionScope.CardAndRingEffects
            })
        });
    }
}


export default InHarmony;
