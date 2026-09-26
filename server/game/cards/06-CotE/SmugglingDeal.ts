import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players, Duration } from '../../Constants.js';

class SmugglingDeal extends DrawCard {
    static id = 'smuggling-deal';

    setupCardAbilities() {
        this.action('Increase an ability\'s limit')
            .cost(AbilityDsl.costs.giveHonorToOpponent())
            .abilityTarget('target', {
                activePromptTitle: 'Select an ability to increase limits on',
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.targetAbility?.card,
                duration: Duration.UntilEndOfRound,
                effect: AbilityDsl.effects.increaseLimitOnAbilities({
                    targetAbility: context.targetAbility
                })
            })))
            .effect('increase the limit on {1}\'s \'{2}\' ability', context => [context.targetAbility?.card, context.targetAbility?.title ?? '']);
    }
}


export default SmugglingDeal;
