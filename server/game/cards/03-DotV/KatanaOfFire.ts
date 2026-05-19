import DrawCard from '../../drawcard.js';
import { CardTypes, Elements } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

const elementKey = 'katana-of-fire-fire';

class KatanaOfFire extends DrawCard {
    static id = 'katana-of-fire';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.modifyMilitarySkill(() => this.totalKatanaModifier())
        });
    }

    canPlay(context, playType) {
        if(!context.player.cardsInPlay.some(card => card.getType() === CardTypes.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }

    // Helper methods for clarity - TODO: needs fixing to not use this.controller
    controllerHasFireRing() {
        return this.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(this.controller);
    }
    numberOfFireCards() {
        return this.controller.getNumberOfCardsInPlay(card => card.hasTrait('fire'));
    }
    totalKatanaModifier() {
        var skillModifier = this.controllerHasFireRing() ? 2 : 0;
        skillModifier += this.numberOfFireCards();
        return skillModifier;
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Fire
        });
        return symbols;
    }
}


export default KatanaOfFire;
