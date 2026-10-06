import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { cancel } from '../../GameActions/GameActions.js';

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
            .cost(AbilityDsl.costs.sacrificeSelf())
            .gameAction(cancel());
    }
}


export default FingerOfJade;
