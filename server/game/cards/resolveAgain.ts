import type { AbilityContext } from '../AbilityContext.js';
import AbilityDsl from '../abilitydsl.js';
import type CardAbility from '../CardAbility.js';
import { Players, TargetMode } from '../Constants.js';
import type Player from '../Player.js';
import type { ThenAbilityProperties } from '../ThenAbility.js';

type ResolvingContext = AbilityContext & { ability: CardAbility };

export function resolveAbilityAgain(context: ResolvingContext, player?: Player) {
    return AbilityDsl.actions.resolveAbility({
        ability: context.ability,
        ...(player && { player }),
        subResolution: true,
        choosingPlayerOverride: context.choosingPlayerOverride ?? undefined
    });
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
