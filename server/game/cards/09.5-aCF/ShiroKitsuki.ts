import { ConflictType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { delayedEffect } from '../../effects.js';
import { claimRing, playerLastingEffect, selectRing } from '../../GameActions/GameActions.js';

export default class ShiroKitsuki extends StrongholdCard {
    static id = 'shiro-kitsuki';

    setupCardAbilities() {
        this.reaction('Name a card')
            .when({
                onConflictDeclared: () => true
            })
            .cost(AbilityDsl.costs.nameCard())
            .gameAction(playerLastingEffect((playerLastingEffectContext) => ({
                targetController: playerLastingEffectContext.player,
                effect: delayedEffect({
                    when: {
                        onCardPlayed: (event, context) =>
                            event.player === context.player.opponent &&
                            event.card.name === playerLastingEffectContext.costs.nameCardCost
                    },
                    multipleTrigger: true,
                    gameAction: selectRing((context) => ({
                        activePromptTitle: 'Choose a ring to claim',
                        ringCondition: (ring) => ring.isUnclaimed(),
                        message: '{0} claims the {1}',
                        messageArgs: (ring) => [context.player, ring],
                        gameAction: claimRing({ takeFate: true, type: ConflictType.Political })
                    }))
                })
            })))
            .effect('claim a ring whenever {1} plays a card named {2}', (context) => [context.player.opponent, context.costs.nameCardCost])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}
