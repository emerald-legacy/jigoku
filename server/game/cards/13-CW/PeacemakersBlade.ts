import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type Ring from '../../Ring.js';
import { cannotBeDeclaredAsAttacker } from '../../effects.js';

class PeacemakersBlade extends DrawCard {
    static id = 'peacemaker-s-blade';

    override setupCardAbilities() {
        this.whileAttached({
            effect: cannotBeDeclaredAsAttacker()
        });
    }

    override canPlayOn(card: BaseCard | Ring) {
        return card.isCard() && card.isCharacter() && !card.isAttacking() && super.canPlayOn(card);
    }
}


export default PeacemakersBlade;

