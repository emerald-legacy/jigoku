import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class AllAndNothing extends DrawCard {
    static id = 'all-and-nothing';

    setupCardAbilities() {
        this.wouldInterrupt('Replace a void effect with another ring effect')
            .when({
                onResolveRingElement: (event, context) =>
                    !!event.ring && event.ring.element === 'void' && event.player === context.player
            })
            .ringTarget('target', {
                ringCondition: (ring, context) => {
                    const event = context?.event;
                    return event?.physicalRing ? ring !== event.physicalRing : ring.element !== 'void';
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
