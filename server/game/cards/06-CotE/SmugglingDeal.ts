import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { increaseLimitOnAbilities } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, Players, Duration } from '../../Constants.js';

class SmugglingDeal extends DrawCard {
    static id = 'smuggling-deal';

    setupCardAbilities() {
        this.action('Increase an ability\'s limit')
            .cost(AbilityDsl.costs.giveHonorToOpponent())
            .abilityTarget({
                activePromptTitle: 'Select an ability to increase limits on',
                cardType: CardType.Character,
                controller: Players.Self
            }, cardLastingEffect(context => ({
                target: context.targetAbility?.card,
                duration: Duration.UntilEndOfRound,
                effect: increaseLimitOnAbilities({
                    targetAbility: context.targetAbility
                })
            })))
            .effect('increase the limit on {1}\'s \'{2}\' ability', context => [context.targetAbility.card, context.targetAbility.title]);
    }
}


export default SmugglingDeal;
