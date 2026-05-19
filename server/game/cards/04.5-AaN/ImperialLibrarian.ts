import DrawCard from '../../drawcard.js';
import { Players } from '../../Constants.js';

class ImperialLibrarian extends DrawCard {
    static id = 'imperial-librarian';

    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card !== context.source,
            targetController: Players.Any,
            effect: ability.effects.modifyGlory(1)
        });
    }
}

export default ImperialLibrarian;
