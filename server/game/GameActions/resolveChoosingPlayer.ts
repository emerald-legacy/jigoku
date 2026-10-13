import type { AbilityContext } from '../AbilityContext.js';
import { Players } from '../Constants.js';
import type Player from '../Player.js';

export type Chooser = Players.Self | Players.Opponent | Player;

/**
 * Who makes an action's choice: the player of the ability, their opponent for `Players.Opponent`, or the given player.
 * A choice of targets (`targets`) goes to whoever the ability's targets are chosen by, when that is overridden.
 * Nobody when the opponent should choose and there is none (a solo game): then nothing is chosen.
 */
export function resolveChoosingPlayer(context: AbilityContext, player: Chooser | undefined, targets = false): Player | undefined {
    if(player === Players.Opponent && !context.player.opponent) {
        return undefined;
    }
    if(targets && context.choosingPlayerOverride) {
        return context.choosingPlayerOverride;
    }
    if(typeof player === 'object') {
        return player;
    }
    return player === Players.Opponent ? context.player.opponent : context.player;
}

export function isChosenByAbilityPlayer(context: AbilityContext, player: Chooser | undefined): boolean {
    return player === undefined || player === Players.Self || player === context.player;
}
