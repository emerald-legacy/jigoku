import type { AbilityContext } from '../AbilityContext.js';
import type Player from '../Player.js';

/**
 * The effect message's tail when an opponent gave the player 1 honor (`optionalHonorTransferFromOpponentCost`)
 * and chose something: '.  <giver> gives <player> 1 honor to <what>'. Empty if nothing was chosen.
 */
export function honorTransferMessage<T extends { name: string }>(
    context: AbilityContext,
    chosen: T | [] | undefined,
    what: (name: string) => string,
    giver: (chosen: T) => Player | undefined = () => context.player.opponent
): string {
    if(!chosen || Array.isArray(chosen)) {
        return '';
    }
    const from = giver(chosen);
    if(!from) {
        return '';
    }
    return '.  ' + from.name + ' gives ' + context.player.name + ' 1 honor to ' + what(chosen.name);
}
