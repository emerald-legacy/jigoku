import DrawCard from '../../DrawCard.js';
import { modifyMilitarySkill } from '../../effects.js';
import { Element } from '../../Constants.js';
import { claimedRingSymbols, hasClaimedAnyRing } from '../claimedRings.js';

const elementSymbols = [
    { key: 'third-tower-guard-earth', element: Element.Earth },
    { key: 'third-tower-guard-water', element: Element.Water }
];

class ThirdTowerGuard extends DrawCard {
    static id = 'third-tower-guard';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => hasClaimedAnyRing(this, elementSymbols, context.player),
            effect: modifyMilitarySkill(2)
        });
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols(elementSymbols)];
    }
}


export default ThirdTowerGuard;
