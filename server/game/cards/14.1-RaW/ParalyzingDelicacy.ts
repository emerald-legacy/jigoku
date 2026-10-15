import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { Location, CardType } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class ParalyzingDelicacy extends DrawCard {
    static id = 'paralyzing-delicacy';

    setupCardAbilities() {
        this.action('-X military equal to facedown provinces')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => ({
                effect: modifyMilitarySkill(-this.getFaceDownProvinceCards(context))
            })))
            .chatText((context) => msg`give ${context.target} -${this.getFaceDownProvinceCards(context)}${'military'}`);
    }

    private getFaceDownProvinceCards(context: AbilityContext) {
        const controller = context.target?.controller;
        if(!controller) {
            return 0;
        }
        return controller
            .getDynastyCardsInProvince(Location.Provinces)
            .filter((card) => card.isFacedown() && card.controller === controller).length;
    }
}


export default ParalyzingDelicacy;
