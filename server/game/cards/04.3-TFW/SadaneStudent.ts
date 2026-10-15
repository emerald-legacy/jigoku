import DrawCard from '../../DrawCard.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { Element } from '../../Constants.js';
import { claimedRingSymbols, hasClaimedAnyRing } from '../claimedRings.js';

const elementSymbols = [
    { key: 'sadane-student-air', element: Element.Air },
    { key: 'sadane-student-fire', element: Element.Fire }
];

class SadaneStudent extends DrawCard {
    static id = 'sadane-student';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => hasClaimedAnyRing(this, elementSymbols, context.player),
            effect: modifyPoliticalSkill(2)
        });
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols(elementSymbols)];
    }
}


export default SadaneStudent;
