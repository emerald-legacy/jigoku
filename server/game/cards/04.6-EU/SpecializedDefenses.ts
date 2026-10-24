import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { modifyProvinceStrengthMultiplier } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class SpecializedDefenses extends DrawCard {
    static id = 'specialized-defenses';

    override setupCardAbilities() {
        this.action('Double province strength')
            .condition((context) => context.game.isDuringConflict())
            .selectAttackedProvince((context) => ({
                cardCondition: (card) => card.element.some((element) =>
                    this.game.ringFor(element)?.isConsideredClaimed(context.player) ||
                    (this.game.currentConflict?.ring?.getElements().includes(element) ?? false)
                ),
                message: (context, cards) => msg`${context.player} doubles the province strength of ${cards}`,
                gameAction: cardLastingEffect({
                    effect: modifyProvinceStrengthMultiplier(2)
                })
            }))
            .chatText('double the province strength of an attacked province');
    }
}


export default SpecializedDefenses;
