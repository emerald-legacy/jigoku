import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';
import { Element } from '../../Constants.js';
import { claimedRingSymbols, hasClaimedAnyRing } from '../claimedRings.js';

const elementSymbols = [
    { key: 'impulsive-novice-fire', element: Element.Fire },
    { key: 'impulsive-novice-void', element: Element.Void }
];

class ImpulsiveNovice extends DrawCard {
    static id = 'impulsive-novice';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => hasClaimedAnyRing(this, elementSymbols, context.player),
            effect: modifyBothSkills(1)
        });
    }

    override getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols(elementSymbols)];
    }
}


export default ImpulsiveNovice;
