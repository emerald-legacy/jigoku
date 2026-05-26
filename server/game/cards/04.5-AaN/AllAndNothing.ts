import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetModes } from '../../Constants.js';

class AllAndNothing extends DrawCard {
    static id = 'all-and-nothing';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Replace a void effect with another ring effect',
            when: {
                onResolveRingElement: (event, context) =>
                    !!event.ring && event.ring.element === 'void' && event.player === context.player
            },
            target: {
                mode: TargetModes.Ring,
                ringCondition: (ring: any, context: any) =>
                    context?.event?.physicalRing ? ring !== context.event.physicalRing : ring.element !== 'void',
                gameAction: AbilityDsl.actions.cancel((context: any) => ({
                    replacementGameAction: AbilityDsl.actions.resolveRingEffect({
                        optional: context.event.optional,
                        physicalRing: context.ring
                    })
                }))
            },
            effect: 'resolve {0} effect instead of the void effect',
            gameAction: AbilityDsl.actions.draw()
        });
    }
}


export default AllAndNothing;
