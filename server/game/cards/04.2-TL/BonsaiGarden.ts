import DrawCard from '../../DrawCard.js';
import { Element } from '../../Constants.js';

const elementKey = 'bonsai-garden-air';

class BonsaiGarden extends DrawCard {
    static id = 'bonsai-garden';

    override setupCardAbilities() {
        this.action('Gain 1 honor')
            .condition((context) => context.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)))
            .gainHonor();
    }

    protected override printedElementSymbols = [
        {
            key: elementKey,
            prettyName: 'Conflict Ring',
            element: Element.Air
        }
    ];
}


export default BonsaiGarden;
