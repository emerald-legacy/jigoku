import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class FingerOfJade extends DrawCard {
    static id = 'finger-of-jade';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.wouldInterrupt({
            title: 'Cancel an ability',
            when: {
                onInitiateAbilityEffects: (event, context) => event.cardTargets.some(card => card === context.source.parent)
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default FingerOfJade;
