import DrawCard from '../../DrawCard.js';
import { Element, Trait } from '../../Constants.js';
import { modifyMilitarySkill } from '../../effects.js';
import { controlsShugenja } from '../controlsShugenja.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'katana-of-fire-fire', element: Element.Fire };

class KatanaOfFire extends DrawCard {
    static id = 'katana-of-fire';

    override setupCardAbilities() {
        this.playOnlyIf((context) => controlsShugenja(context.player));

        this.whileAttached({
            effect: modifyMilitarySkill(() => this.getTotalKatanaModifier())
        });
    }

    getTotalKatanaModifier() {
        const fireRingBonus = hasClaimedRing(this, elementSymbol.key, this.controller) ? 2 : 0;
        return fireRingBonus + this.controller.getNumberOfCardsInPlay((card) => card.hasTrait(Trait.Fire));
    }

    protected override printedElementSymbols = claimedRingSymbols([elementSymbol]);
}


export default KatanaOfFire;
