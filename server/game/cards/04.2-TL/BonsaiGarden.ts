import DrawCard from '../../DrawCard.js';
import { Element } from '../../Constants.js';

const elementKey = 'bonsai-garden-air';

class BonsaiGarden extends DrawCard {
    static id = 'bonsai-garden';

    setupCardAbilities() {
        this.action('Gain 1 honor')
            .condition((context) => context.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)))
            .gainHonor();
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Conflict Ring',
            element: Element.Air
        });
        return symbols;
    }
}


export default BonsaiGarden;
