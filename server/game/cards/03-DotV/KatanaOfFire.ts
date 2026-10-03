import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { controlsShugenja } from '../controlsShugenja.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'katana-of-fire-fire', element: Element.Fire };

class KatanaOfFire extends DrawCard {
    static id = 'katana-of-fire';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.modifyMilitarySkill(() => this.totalKatanaModifier())
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        if(!controlsShugenja(context.player)) {
            return false;
        }

        return super.canPlay(context, playType);
    }

    // Helper methods for clarity - TODO: needs fixing to not use this.controller
    controllerHasFireRing() {
        return hasClaimedRing(this, elementSymbol.key, this.controller);
    }
    numberOfFireCards() {
        return this.controller.getNumberOfCardsInPlay((card) => card.hasTrait('fire'));
    }
    totalKatanaModifier() {
        var skillModifier = this.controllerHasFireRing() ? 2 : 0;
        skillModifier += this.numberOfFireCards();
        return skillModifier;
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default KatanaOfFire;
