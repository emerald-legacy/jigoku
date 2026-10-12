import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class FulfillYourDuty extends DrawCard {
    static id = 'fulfill-your-duty';

    setupCardAbilities() {
        this.action('Add Province Strength')
            .cost(costs.sacrifice({ cardType: CardType.Character }))
            .condition(() => this.game.isDuringConflict())
            .selectAttackedProvince((context) => ({
                message: (context, cards) => msg`${context.player} increases the strength of ${cards}`,
                gameAction: cardLastingEffect(() => ({
                    effect: modifyProvinceStrength(context.costs.sacrificeStateWhenChosen ? context.costs.sacrificeStateWhenChosen.militarySkill : 0)
                }))
            }))
            .chatText((context) => msg`add ${context.costs.sacrificeStateWhenChosen ? context.costs.sacrificeStateWhenChosen.militarySkill : 0} to an attacked province's strength`);
    }
}


export default FulfillYourDuty;
