import type { AbilityContext } from '../AbilityContext.js';
import type { GameAction, GameActionTarget } from '../GameActions/GameAction.js';
import type { MsgArg } from '../GameChat.js';
import type Player from '../Player.js';

/**
 * "An additional cost to `purpose`": `payer` pays `cost` on `target` and the chat says so (with `message`, if given, as what they did),
 * or the chat says they can't. Whether it was paid.
 */
export function payAdditionalCost(
    context: AbilityContext,
    payer: Player,
    cost: GameAction,
    target: GameActionTarget,
    purpose: MsgArg,
    message?: string
): boolean {
    const game = context.game;
    if(!cost.hasLegalTarget(context)) {
        game.addMessage('{0} cannot pay the additional cost required to {1}', payer, purpose);
        return false;
    }
    cost.resolve(target, context);
    game.addMessage('{0} {1} in order to {2}', payer, message ?? game.gameChat.nested(cost.getEffectMessage(context)), purpose);
    return true;
}
