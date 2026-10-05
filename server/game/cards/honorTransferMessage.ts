import type { AbilityContext } from '../AbilityContext.js';

/**
 * The effect message's tail when an opponent gave the player 1 honor (`optionalHonorTransferFromOpponentCost`)
 * and chose something: '.  <opponent> gives <player> 1 honor to <what>'. Empty if nothing was chosen.
 */
export function honorTransferMessage<T extends { name: string }>(
    context: AbilityContext,
    chosen: T | [] | undefined,
    what: (name: string) => string
): string {
    const giver = context.player.opponent;
    if(!chosen || Array.isArray(chosen) || !giver) {
        return '';
    }
    return '.  ' + giver.name + ' gives ' + context.player.name + ' 1 honor to ' + what(chosen.name);
}
