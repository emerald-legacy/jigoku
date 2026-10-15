import { reduceCost } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Players, elementTrait } from '../../Constants.js';

class InquisitiveIshika extends DrawCard {
    static id = 'inquisitive-ishika';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict(),
            targetController: Players.Any,
            effect: reduceCost({ match: (card) => this.game.currentConflict?.elements.some((element) => card.hasTrait(elementTrait(element))) ?? false })
        });
    }
}


export default InquisitiveIshika;
