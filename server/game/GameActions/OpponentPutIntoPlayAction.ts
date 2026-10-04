import type { AbilityContext } from '../AbilityContext.js';
import { Players } from '../Constants.js';
import type Player from '../Player.js';
import { PutIntoPlayAction, type PutIntoPlayProperties } from './PutIntoPlayAction.js';

export type OpponentPutIntoPlayProperties = PutIntoPlayProperties;

export class OpponentPutIntoPlayAction<C extends AbilityContext = AbilityContext> extends PutIntoPlayAction<C> {
    defaultProperties: PutIntoPlayProperties = {
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
