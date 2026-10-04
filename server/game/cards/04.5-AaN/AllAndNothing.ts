import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Element } from '../../Constants.js';

class AllAndNothing extends DrawCard {
    static id = 'all-and-nothing';

    setupCardAbilities() {
        this.wouldInterrupt('Replace a void effect with another ring effect')
            .when({
                onResolveRingElement: (event, context) =>
                    event.ring.element === Element.Void && event.player === context.player
            })
            .ringTarget('target', {
                ringCondition: (ring, context) => {
                    const event = context.event;
                    return event.physicalRing ? ring !== event.physicalRing : ring.element !== Element.Void;
                }
            }, AbilityDsl.actions.cancel((context) => ({
                replacementGameAction: AbilityDsl.actions.resolveRingEffect({
                    optional: context.event.optional,
                    physicalRing: context.ring
                })
            })))
            .gameAction(AbilityDsl.actions.draw())
            .effect('resolve {0} effect instead of the void effect');
    }
}


export default AllAndNothing;
