import type { AbilityContext } from '../AbilityContext.js';
import type Player from '../Player.js';
import { isCardEffect } from '../Effects/Restriction.js';

/** An opponent's ring effect or card effect (costs are not effects). */
export function isOpponentsRingOrCardEffect(player: Player, context: AbilityContext | undefined): boolean {
    return !!context && player.opponent === context.player && (context.source.isRing() || isCardEffect(context));
}

export function isOwnRingEffect(player: Player, context: AbilityContext | undefined): boolean {
    return player === context?.player && context.source.isRing();
}
