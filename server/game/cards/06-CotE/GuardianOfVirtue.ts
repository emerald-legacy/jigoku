import { doesNotBow } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class GuardianOfVirtue extends DrawCard {
    static id = 'guardian-of-virtue';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDefending() && context.player.hasComposure(),
            effect: doesNotBow()
        });
    }
}


export default GuardianOfVirtue;
