import DrawCard from '../../DrawCard.js';
import { Element } from '../../Constants.js';
import { claimedRingSymbols, isRingClaimed } from '../claimedRings.js';

const elementSymbol = { key: 'prodigy-of-the-waves-water', element: Element.Water };

class ProdigyOfTheWaves extends DrawCard {
    static id = 'prodigy-of-the-waves';

    override setupCardAbilities() {
        this.action('Ready this character')
            .condition(() => isRingClaimed(this, elementSymbol.key))
            .ready();
    }

    protected override printedElementSymbols = claimedRingSymbols([elementSymbol]);
}


export default ProdigyOfTheWaves;
