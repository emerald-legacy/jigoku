import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class InHarmony extends DrawCard {
    static id = 'in-harmony';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'removeFate',
                restricts: 'cardAndRingEffects'
            })
        });
    }

    canPlay(context: any) {
        return context.player.getClaimedRings().length >= 1;
    }
}


export default InHarmony;
