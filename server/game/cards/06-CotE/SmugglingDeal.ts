import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { increaseLimitOnAbilities } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';
import { getExtraUseDuration } from '../extraAbilityUse.js';
import { msg } from '../../GameChat.js';

class SmugglingDeal extends DrawCard {
    static id = 'smuggling-deal';

    override setupCardAbilities() {
        this.action('Increase an ability\'s limit')
            .cost(costs.giveHonorToOpponent())
            .abilityTarget({
                activePromptTitle: 'Select an ability to increase limits on',
                cardType: CardType.Character,
                controller: Players.Self
            }, cardLastingEffect((context) => ({
                target: context.targetAbility?.card,
                duration: getExtraUseDuration(context.targetAbility),
                effect: increaseLimitOnAbilities({
                    targetAbility: context.targetAbility
                })
            })))
            .chatText((context) => msg`increase the limit on ${context.targetAbility.card}'s '${context.targetAbility.title}' ability`);
    }
}


export default SmugglingDeal;
