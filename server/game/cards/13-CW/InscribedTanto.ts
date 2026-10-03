import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Element } from '../../Constants.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'inscribed-tanto-void', element: Element.Void };

class InscribedTanto extends DrawCard {
    static id = 'inscribed-tanto';

    setupCardAbilities() {
        this.whileAttached({
            condition: context => hasClaimedRing(this, elementSymbol.key, context.player),
            effect: AbilityDsl.effects.immunity({
                restricts: 'opponentsRingEffects'
            })
        });
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default InscribedTanto;
