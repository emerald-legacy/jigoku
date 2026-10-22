import type { AbilityContext } from '../AbilityContext.js';
import type Player from '../Player.js';

export function isOpponentsRingOrCardEffect(player: Player, context: AbilityContext | undefined): boolean {
    return !!context && player.opponent === context.player && (context.source.isRing() || context.ability.isCardAbility());
}

export function isOwnRingEffect(player: Player, context: AbilityContext | undefined): boolean {
    return player === context?.player && context.source.isRing();
}
