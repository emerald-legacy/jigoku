import DrawCard from '../../DrawCard.js';
import { immunity } from '../../effects.js';
import { Element, RestrictionScope } from '../../Constants.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'inscribed-tanto-void', element: Element.Void };

class InscribedTanto extends DrawCard {
    static id = 'inscribed-tanto';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context) => hasClaimedRing(this, elementSymbol.key, context.player),
            effect: immunity({
                appliesTo: RestrictionScope.OpponentsRingEffects
            })
        });
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default InscribedTanto;
