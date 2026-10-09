import type { AbilityContext } from '../AbilityContext.js';
import type { GameAction, GameActionTarget } from '../GameActions/GameAction.js';
import { msg, type MessageArgs, type MsgArg } from '../GameChat.js';
import type Player from '../Player.js';

/**
 * "An additional cost to `purpose`": `payer` pays `cost` on `target` and the chat says so (with `chatText`, if given, as what they did),
 * or the chat says they can't. Whether it was paid.
 */
export function payAdditionalCost(
    context: AbilityContext,
    payer: Player,
    cost: GameAction,
    target: GameActionTarget,
    purpose: MsgArg,
    chatText?: (context: AbilityContext) => MessageArgs
): boolean {
    const game = context.game;
    if(!cost.hasLegalTarget(context)) {
        game.addMessage(msg`${payer} cannot pay the additional cost required to ${purpose}`);
        return false;
    }
    cost.resolve(target, context);
    game.addMessage(msg`${payer} ${game.gameChat.nested(chatText ? chatText(context) : cost.getEffectMessage(context))} in order to ${purpose}`);
    return true;
}
