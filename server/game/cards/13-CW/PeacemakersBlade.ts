import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type Ring from '../../Ring.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class PeacemakersBlade extends DrawCard {
    static id = 'peacemaker-s-blade';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cannotBeDeclaredAsAttacker()
        });
    }

    canPlayOn(card: BaseCard | Ring) {
        return ((card as DrawCard).getType() === CardType.Character && !(card as DrawCard).isAttacking()) && super.canPlayOn(card);
    }
}


export default PeacemakersBlade;

