import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class FulfillYourDuty extends DrawCard {
    static id = 'fulfill-your-duty';

    override setupCardAbilities() {
        this.action('Add Province Strength')
            .condition(() => this.game.isDuringConflict())
            .cost(costs.sacrifice({ cardType: CardType.Character }))
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
