import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Element } from '../../Constants.js';
import { modifyProvinceStrengthMultiplier } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { isEnumValue } from '../../utils/helpers.js';

class SpecializedDefenses extends DrawCard {
    static id = 'specialized-defenses';

    override setupCardAbilities() {
        this.conflictAction('Double province strength')
            .selectAttackedProvince((context) => ({
                cardCondition: (card) => card.element.some((element: string) => {
                    if(element === 'all') {
                        return true;
                    }
                    return this.game.ringFor(element)?.isConsideredClaimed(context.player) ||
                           (isEnumValue(Element, element) && (this.game.currentConflict?.ring?.getElements().includes(element) ?? false));
                }),
                message: (context, cards) => msg`${context.player} doubles the province strength of ${cards}`,
                gameAction: cardLastingEffect({
                    effect: modifyProvinceStrengthMultiplier(2)
                })
            }))
            .chatText('double the province strength of an attacked province');
    }
}


export default SpecializedDefenses;
