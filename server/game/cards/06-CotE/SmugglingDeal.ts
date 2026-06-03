import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players, Duration, TargetMode } from '../../Constants.js';

class SmugglingDeal extends DrawCard {
    static id = 'smuggling-deal';

    setupCardAbilities() {
        this.action({
            title: 'Increase an ability\'s limit',
            cost: AbilityDsl.costs.giveHonorToOpponent(),
            target: {
                activePromptTitle: 'Select an ability to increase limits on',
                mode: TargetMode.Ability,
                cardType: CardType.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.targetAbility.card,
                    duration: Duration.UntilEndOfRound,
                    effect: AbilityDsl.effects.increaseLimitOnAbilities({
                        targetAbility: context.targetAbility
                    })
                }))
            },
            effect: 'increase the limit on {1}\'s \'{2}\' ability',
            effectArgs: context => [context.targetAbility?.card as DrawCard, context.targetAbility?.title ?? '']
        });
    }
}


export default SmugglingDeal;
