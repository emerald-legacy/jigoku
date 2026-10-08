import DrawCard from '../../DrawCard.js';
import { Phase, Element } from '../../Constants.js';
import { cardCannot } from '../../effects.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'ascetic-of-the-north-wall-earth', element: Element.Earth };

class AsceticOfTheNorthWall extends DrawCard {
    static id = 'ascetic-of-the-north-wall';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => hasClaimedRing(this, elementSymbol.key, context.player) && context.game.currentPhase !== Phase.Fate,
            effect: [
                cardCannot('removeFate'),
                cardCannot('discardFromPlay')
            ]
        });
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default AsceticOfTheNorthWall;
