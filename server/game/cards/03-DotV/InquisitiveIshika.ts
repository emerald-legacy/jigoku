import DrawCard from '../../drawcard.js';
import { Players } from '../../Constants.js';

class InquisitiveIshika extends DrawCard {
    static id = 'inquisitive-ishika';

    setupCardAbilities(ability: any) {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict(),
            targetController: Players.Any,
            effect: ability.effects.reduceCost({ match: (card: DrawCard) => this.game.currentConflict?.elements.some((element: string) => card.hasTrait(element)) ?? false })
        });
    }
}


export default InquisitiveIshika;
