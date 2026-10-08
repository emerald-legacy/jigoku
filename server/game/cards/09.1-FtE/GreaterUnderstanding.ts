import { resolveRingEffect } from '../../GameActions/GameActions.js';
import Ring from '../../Ring.js';
import { RingAttachment } from '../RingAttachment.js';

class GreaterUnderstanding extends RingAttachment {
    static id = 'greater-understanding';

    setupCardAbilities() {
        this.reaction('Resolve the attached ring\'s effect')
            .when({
                onMoveFate: (event) => event.recipient === this.parent,
                onPlaceFateOnUnclaimedRings: () => this.parent instanceof Ring && this.parent.isUnclaimed()
            })
            .gameAction(resolveRingEffect((context) => ({ target: context.source.parent ?? [] })));
    }
}


export default GreaterUnderstanding;

