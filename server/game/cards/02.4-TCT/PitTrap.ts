import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type Ring from '../../Ring.js';
import { doesNotReady } from '../../effects.js';

class PitTrap extends DrawCard {
    static id = 'pit-trap';

    setupCardAbilities() {
        this.whileAttached({
            effect: doesNotReady()
        });
    }

    canPlayOn(card: BaseCard | Ring): boolean {
        return card instanceof DrawCard && card.isAttacking() && super.canPlayOn(card);
    }
}


export default PitTrap;
