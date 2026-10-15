import DrawCard from '../../DrawCard.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { Element } from '../../Constants.js';
import { claimedRingSymbols, hasClaimedAnyRing } from '../claimedRings.js';

const elementSymbols = [
    { key: 'reader-of-omens-air', element: Element.Air },
    { key: 'reader-of-omens-void', element: Element.Void }
];

class ReaderOfOmens extends DrawCard {
    static id = 'reader-of-omens';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => hasClaimedAnyRing(this, elementSymbols, context.player),
            effect: modifyPoliticalSkill(3)
        });
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols(elementSymbols)];
    }
}


export default ReaderOfOmens;
