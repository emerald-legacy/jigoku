import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class FulfillYourDuty extends DrawCard {
    static id = 'fulfill-your-duty';

    setupCardAbilities() {
        this.action('Add Province Strength')
            .cost(costs.sacrifice({ cardType: CardType.Character }))
            .condition(() => this.game.isDuringConflict())
            .selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: card => card.isConflictProvince(),
                message: '{0} increases the strength of {1}',
                messageArgs: cards => [context.player, cards],
                gameAction: cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: modifyProvinceStrength(context.costs.sacrificeStateWhenChosen ? context.costs.sacrificeStateWhenChosen.militarySkill : 0)
                }))
            }))
            .chatText('add {1} to an attacked province\'s strength', context => context.costs.sacrificeStateWhenChosen ? context.costs.sacrificeStateWhenChosen.militarySkill : 0);
    }
}


export default FulfillYourDuty;
