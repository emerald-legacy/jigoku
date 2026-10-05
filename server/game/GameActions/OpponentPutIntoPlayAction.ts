import type { AbilityContext } from '../AbilityContext.js';
import { Players } from '../Constants.js';
import type Player from '../Player.js';
import { PutIntoPlayAction, type PutIntoPlayDefaults, type PutIntoPlayProperties } from './PutIntoPlayAction.js';
import type { Defaults } from './GameAction.js';

export type OpponentPutIntoPlayProperties = PutIntoPlayProperties;

export class OpponentPutIntoPlayAction<C extends AbilityContext = AbilityContext> extends PutIntoPlayAction<C> {
    defaultProperties: Defaults<PutIntoPlayProperties, PutIntoPlayDefaults> = {
        fate: 0,
        status: 'ordinary',
        controller: Players.Opponent
    };

    getDefaultSide(context: AbilityContext): Player {
        return context.player.opponent ?? context.player;
    }

    getPutIntoPlayPlayer(context: AbilityContext): Player {
        return context.player.opponent ?? context.player;
    }
}
