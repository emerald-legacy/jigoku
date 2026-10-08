import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';
import { Element } from '../../Constants.js';
import { claimedRingSymbols, claimsRingOf } from '../claimedRings.js';

const elementSymbol = { key: 'kudaka-air', element: Element.Air };

class Kudaka extends DrawCard {
    static id = 'kudaka';

    setupCardAbilities() {
        this.reaction('Gain 1 fate and draw 1 card')
            .when({
                onClaimRing: (event, context) => claimsRingOf(this, elementSymbol.key, event) && event.player === context.player
            })
            .gainFate().draw()
            .chatText('gain 1 fate and draw 1 card')
            .limit(perRound(2));
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default Kudaka;
