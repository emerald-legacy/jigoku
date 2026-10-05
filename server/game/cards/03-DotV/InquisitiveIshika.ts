import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';

class InquisitiveIshika extends DrawCard {
    static id = 'inquisitive-ishika';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict(),
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({ match: (card) => this.game.currentConflict?.elements.some((element) => card.hasTrait(element)) ?? false })
        });
    }
}


export default InquisitiveIshika;
