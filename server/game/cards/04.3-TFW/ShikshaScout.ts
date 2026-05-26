import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class ShikshaScout extends DrawCard {
    static id = 'shiksha-scout';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: AbilityDsl.effects.additionalCharactersInConflict(1)
        });
    }
}


export default ShikshaScout;
