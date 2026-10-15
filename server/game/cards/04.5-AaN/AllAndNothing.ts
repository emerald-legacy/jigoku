import DrawCard from '../../DrawCard.js';
import { cancel, resolveRingEffect } from '../../GameActions/GameActions.js';
import { Element } from '../../Constants.js';

class AllAndNothing extends DrawCard {
    static id = 'all-and-nothing';

    setupCardAbilities() {
        this.wouldInterrupt('Replace a void effect with another ring effect')
            .when({
                onResolveRingElement: (event, context) =>
                    event.ring.element === Element.Void && event.player === context.player
            })
            .ringTarget({
                ringCondition: (ring, context) => {
                    const event = context.event;
                    return event.physicalRing ? ring !== event.physicalRing : ring.element !== Element.Void;
                }
            }, cancel((context) => ({
                replacementGameAction: resolveRingEffect({
                    optional: context.event.optional,
                    physicalRing: context.ring
                })
            })))
            .draw()
            .chatText('resolve {0} effect instead of the void effect');
    }
}


export default AllAndNothing;
