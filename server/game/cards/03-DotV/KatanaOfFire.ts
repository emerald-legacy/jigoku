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
            effect: modifyMilitarySkill(() => this.totalKatanaModifier())
        });
    }

    // Helper methods for clarity - TODO: needs fixing to not use this.controller
    controllerHasFireRing() {
        return hasClaimedRing(this, elementSymbol.key, this.controller);
    }
    numberOfFireCards() {
        return this.controller.getNumberOfCardsInPlay((card) => card.hasTrait(Trait.Fire));
    }
    totalKatanaModifier() {
        let skillModifier = this.controllerHasFireRing() ? 2 : 0;
        skillModifier += this.numberOfFireCards();
        return skillModifier;
    }

    override getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default KatanaOfFire;
