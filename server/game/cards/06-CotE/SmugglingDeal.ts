import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { increaseLimitOnAbilities } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, Players, Duration, EventName } from '../../Constants.js';
import type { CardAbility } from '../../CardAbility.js';
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
                duration: this.getExtraUseDuration(context.targetAbility),
                effect: increaseLimitOnAbilities({
                    targetAbility: context.targetAbility
                })
            })))
            .chatText((context) => msg`increase the limit on ${context.targetAbility.card}'s '${context.targetAbility.title}' ability`);
    }

    // one additional use: in the ability's own limit period, or this round
    private getExtraUseDuration(ability: CardAbility | undefined): Duration {
        const resetEvents = ability?.limit?.getResetEvents() ?? new Set();
        if(resetEvents.has(EventName.OnConflictFinished)) {
            return Duration.UntilEndOfConflict;
        }
        if(resetEvents.has(EventName.OnPhaseEnded)) {
            return Duration.UntilEndOfPhase;
        }
        return Duration.UntilEndOfRound;
    }
}


export default SmugglingDeal;
