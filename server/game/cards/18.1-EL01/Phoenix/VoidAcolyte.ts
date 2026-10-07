import DrawCard from '../../../DrawCard.js';
import { Element } from '../../../Constants.js';
import { claimsRingOf } from '../../claimedRings.js';

const elementKey = 'void-acolyte-void';

class VoidAcolyte extends DrawCard {
    static id = 'void-acolyte';

    setupCardAbilities() {
        this.reaction('Gain fate')
            .when({
                onClaimRing: (event, context) => event.player === context.player && claimsRingOf(this, elementKey, event)
            })
            .placeFate();
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ring',
            element: Element.Void
        });
        return symbols;
    }

}

export default VoidAcolyte;
