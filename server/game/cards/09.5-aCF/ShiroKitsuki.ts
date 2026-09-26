import { Duration, EventName } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import type { AbilityContext } from '../../AbilityContext.js';
export default class ShiroKitsuki extends StrongholdCard {
    static id = 'shiro-kitsuki';

    setupCardAbilities() {
        this.reaction('Name a card')
            .when({
                onConflictDeclared: () => true
            })
            .cost(AbilityDsl.costs.nameCard())
            .gameAction(AbilityDsl.actions.playerLastingEffect((playerLastingEffectContext) => ({
                targetController: playerLastingEffectContext.player,
                duration: Duration.UntilEndOfConflict,
                effect: AbilityDsl.effects.delayedEffect({
                    when: {
                        onCardPlayed: (event: EventPayload<EventName.OnCardPlayed>, context: AbilityContext) =>
                            event.player === context.player.opponent &&
                            event.card.name === playerLastingEffectContext.costs.nameCardCost
                    },
                    multipleTrigger: true,
                    gameAction: AbilityDsl.actions.selectRing((context) => ({
                        activePromptTitle: 'Choose a ring to claim',
                        ringCondition: (ring) => ring.isUnclaimed(),
                        message: '{0} claims the {1}',
                        messageArgs: (ring) => [context.player, ring],
                        gameAction: AbilityDsl.actions.claimRing({ takeFate: true, type: 'political' })
                    }))
                })
            })))
            .effect('claim a ring whenever {1} plays a card named {2}', (context) => [context.player.opponent, context.costs.nameCardCost])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}
