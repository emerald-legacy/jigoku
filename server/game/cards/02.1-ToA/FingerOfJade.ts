import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';

class FingerOfJade extends DrawCard {
    static id = 'finger-of-jade';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.wouldInterrupt('Cancel an ability')
            .when({
                onInitiateAbilityEffects: (event, context) => event.cardTargets.some(card => card === context.source.parentCharacter)
            })
            .cost(costs.sacrificeSelf())
            .cancel();
    }
}


export default FingerOfJade;
