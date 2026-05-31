import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Elements } from '../../Constants.js';

const elementKey = 'bonsai-garden-air';

class BonsaiGarden extends DrawCard {
    static id = 'bonsai-garden';

    setupCardAbilities() {
        this.action({
            title: 'Gain 1 honor',
            condition: context => context.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)),
            gameAction: AbilityDsl.actions.gainHonor()
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Conflict Ring',
            element: Elements.Air
        });
        return symbols;
    }
}


export default BonsaiGarden;
