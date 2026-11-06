import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { Location, CardType } from '../../Constants.js';
import { msg } from '../../GameChat.js';
import type Player from '../../Player.js';

class ParalyzingDelicacy extends DrawCard {
    static id = 'paralyzing-delicacy';

    override setupCardAbilities() {
        this.action('-X military equal to facedown provinces')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && this.getFaceDownProvinceCards(card.controller) > 0
            }, cardLastingEffect((context) => ({
                effect: modifyMilitarySkill(-this.getTargetFaceDownProvinceCards(context))
            })))
            .chatText((context) => msg`give ${context.target} -${this.getTargetFaceDownProvinceCards(context)}${'military'}`);
    }

    private getTargetFaceDownProvinceCards(context: AbilityContext) {
        const controller = context.target?.controller;
        return controller ? this.getFaceDownProvinceCards(controller) : 0;
    }

    private getFaceDownProvinceCards(controller: Player) {
        return controller
            .getDynastyCardsInProvince(Location.Provinces)
            .filter((card) => card.isFacedown() && card.controller === controller).length;
    }
}


export default ParalyzingDelicacy;
