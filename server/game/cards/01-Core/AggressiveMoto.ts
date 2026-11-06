import DrawCard from '../../DrawCard.js';
import { cannotBeDeclaredAsDefender } from '../../effects.js';

class AggressiveMoto extends DrawCard {
    static id = 'aggressive-moto';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: cannotBeDeclaredAsDefender()
        });
    }
}


export default AggressiveMoto;
