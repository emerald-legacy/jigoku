import type { AbilityContext } from '../AbilityContext.js';
import type Player from '../Player.js';
import Ring from '../Ring.js';

/** Whether an event's `context` is a ring effect or card ability of the player's opponent. */
export function isOpponentsRingOrCardEffect(player: Player, context: AbilityContext | undefined): boolean {
    return !!context && player.opponent === context.player && (context.source instanceof Ring || context.ability.isCardAbility());
}

/** Whether an event's `context` is a ring effect of the player. */
export function isOwnRingEffect(player: Player, context: AbilityContext | undefined): boolean {
    return player === context?.player && context.source instanceof Ring;
}
