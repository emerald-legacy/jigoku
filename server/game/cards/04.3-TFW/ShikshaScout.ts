import { additionalCharactersInConflict } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class ShikshaScout extends DrawCard {
    static id = 'shiksha-scout';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            effect: additionalCharactersInConflict(1)
        });
    }
}


export default ShikshaScout;
