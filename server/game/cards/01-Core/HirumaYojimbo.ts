import DrawCard from '../../DrawCard.js';
import { cannotBeDeclaredAsAttacker } from '../../effects.js';

class HirumaYojimbo extends DrawCard {
    static id = 'hiruma-yojimbo';

    setupCardAbilities() {
        this.persistentEffect({
            effect: cannotBeDeclaredAsAttacker()
        });
    }
}


export default HirumaYojimbo;
