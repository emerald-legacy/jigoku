import { ConflictType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { delayedEffect } from '../../effects.js';
import { claimRing, selectRing } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

export default class ShiroKitsuki extends StrongholdCard {
    static id = 'shiro-kitsuki';

    setupCardAbilities() {
        this.reaction('Name a card')
            .when({
                onConflictDeclared: () => true
            })
            .cost(costs.nameCard())
            .playerLastingEffect((playerLastingEffectContext) => ({
                targetController: playerLastingEffectContext.player,
                effect: delayedEffect({
                    when: {
                        onCardPlayed: (event, context) =>
                            event.player === context.player.opponent &&
                            event.card.name === playerLastingEffectContext.costs.namedCard
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
            }))
            .effect((context) => msg`claim a ring whenever ${context.player.opponent} plays a card named ${context.costs.namedCard}`)
            .limit(unlimitedPerConflict());
    }
}
