import { RingAttachment } from '../RingAttachment.js';

class GreaterUnderstanding extends RingAttachment {
    static id = 'greater-understanding';

    override setupCardAbilities() {
        this.reaction('Resolve the attached ring\'s effect')
            .when({
                onMoveFate: (event) => event.recipient === this.parent,
                onPlaceFateOnUnclaimedRings: () => this.parent?.isRing() && this.parent.isUnclaimed()
            })
            .resolveRingEffect((context) => ({ target: context.source.parent ?? [] }));
    }
}


export default GreaterUnderstanding;

