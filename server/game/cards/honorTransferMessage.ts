import type { AbilityContext } from '../AbilityContext.js';
import { msg, type MessageArgs, type MsgArg } from '../GameChat.js';

/**
 * The effect message's tail when an opponent gave the player 1 honor (`optionalHonorTransferFromOpponentCost`)
 * and chose something: '. <opponent> gives <player> 1 honor to <what>'. Empty if nothing was chosen.
 */
export function honorTransferMessage<Chosen extends { name: string }>(
    context: AbilityContext,
    chosen: Chosen | [] | undefined,
    what: (chosen: Chosen) => MessageArgs
): MsgArg {
    const giver = context.player.opponent;
    if(!chosen || Array.isArray(chosen) || !giver) {
        return '';
    }
    return context.game.gameChat.nested(msg`. ${giver} gives ${context.player} 1 honor to ${context.game.gameChat.nested(what(chosen))}`);
}
