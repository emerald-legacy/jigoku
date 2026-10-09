import type { AbilityContext } from '../AbilityContext.js';
import { Players } from '../Constants.js';
import type Player from '../Player.js';

/**
 * Who makes an action's choice: the player of the ability, or their opponent for `Players.Opponent`.
 * A choice of targets (`targets`) goes to whoever the ability's targets are chosen by, when that is overridden.
 * Nobody when the opponent should choose and there is none (a solo game): then nothing is chosen.
 */
export function resolveChoosingPlayer(context: AbilityContext, player: Players.Self | Players.Opponent | undefined, targets = false): Player | undefined {
    if(player === Players.Opponent && !context.player.opponent) {
        return undefined;
    }
    if(targets && context.choosingPlayerOverride) {
        return context.choosingPlayerOverride;
    }
    return player === Players.Opponent ? context.player.opponent : context.player;
}
