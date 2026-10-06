import type { AbilityContext } from '../AbilityContext.js';
import { resolveAbility } from '../GameActions/GameActions.js';
import type CardAbility from '../CardAbility.js';
import type { Event } from '../Events/Event.js';
import { Players, TargetMode } from '../Constants.js';
import type Player from '../Player.js';
import type { ThenAbilityProperties } from '../ThenAbility.js';

/** A trigger's context also holds its event, which a triggered ability resolves with again. */
type ResolvingContext = AbilityContext & { ability: CardAbility; event?: Event };

export function resolveAbilityAgain(context: ResolvingContext, player?: Player) {
    return resolveAbility({
        ability: context.ability,
        ...(player && { player }),
        ...(context.event && { event: context.event }),
        subResolution: true,
        choosingPlayerOverride: context.choosingPlayerOverride ?? undefined
    });
}

/** A `then` letting the player choose to resolve the ability again ("you may resolve this ability twice"). */
export function mayResolveAgain(context: ResolvingContext, activePromptTitle: string): ThenAbilityProperties {
    const resolveAgain = resolveAbilityAgain(context);
    return {
        target: {
            mode: TargetMode.Select,
            activePromptTitle,
            choices: {
                Yes: resolveAgain,
                // nothing to choose when the ability can't resolve again
                No: (thenContext: AbilityContext) => resolveAgain.hasLegalTarget(thenContext)
            }
        },
        message: '{0} chooses {3}to resolve {1} again',
        messageArgs: (thenContext: AbilityContext) => [thenContext.select === 'No' ? 'not ' : '']
    };
}

/** A `then` letting the opponent (or the player in a solo game) choose to resolve the ability again. */
export function opponentMayResolveAgain(context: ResolvingContext, activePromptTitle: string): ThenAbilityProperties {
    const player = context.player.opponent ?? context.player;
    const resolveAgain = resolveAbilityAgain(context, player);
    return {
        target: {
            player: context.player.opponent ? Players.Opponent : Players.Self,
            mode: TargetMode.Select,
            activePromptTitle,
            choices: {
                Yes: resolveAgain,
                // nothing to choose when the ability can't resolve again
                No: (thenContext: AbilityContext) => resolveAgain.hasLegalTarget(thenContext)
            }
        },
        message: '{3} chooses {4}to resolve {1}\'s ability again',
        messageArgs: (thenContext: AbilityContext) => [player, thenContext.select === 'No' ? 'not ' : '']
    };
}
