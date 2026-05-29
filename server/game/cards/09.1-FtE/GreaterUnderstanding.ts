import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class GreaterUnderstanding extends DrawCard {
    static id = 'greater-understanding';

    setupCardAbilities() {
        this.reaction({
            when: {
                onMoveFate: (event) => event.recipient === this.parent,
                onPlaceFateOnUnclaimedRings: () => !!this.parent && (this.parent as any).isUnclaimed?.()
            },
            title: 'Resolve the attached ring\'s effect',
            gameAction: AbilityDsl.actions.resolveRingEffect(context => ({ target: context.source.parent }))
        });
    }
    canAttach(ring: any) {
        return ring && ring.type === 'ring';
    }
    canPlayOn(source: any) {
        return source && source.getType() === 'ring' && this.getType() === CardTypes.Attachment;
    }
    mustAttachToRing() {
        return true;
    }
}


export default GreaterUnderstanding;

