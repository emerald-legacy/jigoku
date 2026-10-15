import DrawCard from '../../DrawCard.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { Element } from '../../Constants.js';
import { claimedRingSymbols, hasClaimedAnyRing } from '../claimedRings.js';

const elementSymbols = [
    { key: 'court-novice-air', element: Element.Air },
    { key: 'court-novice-water', element: Element.Water }
];

class CourtNovice extends DrawCard {
    static id = 'court-novice';

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


export default CourtNovice;
