import DrawCard from '../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import type { AbilityContext } from '../../AbilityContext.js';
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
                    context?.event?.physicalRing ? ring !== (context as TriggeredAbilityContext).event.physicalRing : ring.element !== 'void',
                gameAction: AbilityDsl.actions.cancel((context: AbilityContext) => ({
                    replacementGameAction: AbilityDsl.actions.resolveRingEffect({
                        optional: (context as TriggeredAbilityContext).event.optional,
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
