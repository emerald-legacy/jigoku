import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { draw, gainFate } from '../../GameActions/GameActions.js';
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
            .gameAction(gainFate(), draw())
            .effect('gain 1 fate and draw 1 card')
            .limit(AbilityDsl.limit.perRound(2));
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default Kudaka;
