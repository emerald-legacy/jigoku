import { RingAttachment } from '../RingAttachment.js';

class GreaterUnderstanding extends RingAttachment {
    static id = 'greater-understanding';

    override setupCardAbilities() {
        this.reaction('Resolve the attached ring\'s effect')
            .when({
                onMoveFate: (event, context) => event.recipient === context.source.parent,
                onPlaceFateOnUnclaimedRings: (_event, context) => context.source.parent?.isRing() && context.source.parent.isUnclaimed()
            })
            .resolveRingEffect((context) => ({ target: context.source.parent ?? [] }));
    }
}


export default GreaterUnderstanding;

