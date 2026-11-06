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

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => hasClaimedAnyRing(this, elementSymbols, context.player),
            effect: modifyPoliticalSkill(3)
        });
    }

    protected override printedElementSymbols = claimedRingSymbols(elementSymbols);
}


export default ReaderOfOmens;
