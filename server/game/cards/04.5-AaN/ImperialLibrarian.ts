import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';

class ImperialLibrarian extends DrawCard {
    static id = 'imperial-librarian';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => !!context && card !== context.source,
            targetController: Players.Any,
            effect: AbilityDsl.effects.modifyGlory(1)
        });
    }
}

export default ImperialLibrarian;
