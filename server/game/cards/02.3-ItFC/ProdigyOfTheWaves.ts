import DrawCard from '../../DrawCard.js';
import { Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { claimedRingSymbols, isRingClaimed } from '../claimedRings.js';

const elementSymbol = { key: 'prodigy-of-the-waves-water', element: Element.Water };

class ProdigyOfTheWaves extends DrawCard {
    static id = 'prodigy-of-the-waves';

    setupCardAbilities() {
        this.action('Ready this character')
            .condition(() => isRingClaimed(this, elementSymbol.key))
            .gameAction(AbilityDsl.actions.ready());
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default ProdigyOfTheWaves;
