import type BaseCard from '../../BaseCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import Ring from '../../Ring.js';

class GreaterUnderstanding extends DrawCard {
    static id = 'greater-understanding';

    setupCardAbilities() {
        this.reaction({
            when: {
                onMoveFate: (event) => event.recipient === this.parent,
                onPlaceFateOnUnclaimedRings: () => this.parent instanceof Ring && this.parent.isUnclaimed()
            },
            title: 'Resolve the attached ring\'s effect',
            gameAction: AbilityDsl.actions.resolveRingEffect(context => ({ target: context.source.parent }))
        });
    }
    canAttach(ring: BaseCard | Ring) {
        return ring && ring.type === 'ring';
    }
    canPlayOn(source: BaseCard | Ring) {
        return source && source.getType() === 'ring' && this.getType() === CardType.Attachment;
    }
    mustAttachToRing() {
        return true;
    }
}


export default GreaterUnderstanding;

