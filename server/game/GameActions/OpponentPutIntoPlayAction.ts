import { AbilityContext } from '../AbilityContext.js';
import { Players } from '../Constants.js';
import type Player from '../Player.js';
import { PutIntoPlayAction, PutIntoPlayProperties } from './PutIntoPlayAction.js';

export type OpponentPutIntoPlayProperties = PutIntoPlayProperties;

export class OpponentPutIntoPlayAction<C extends AbilityContext = AbilityContext> extends PutIntoPlayAction<C> {
    defaultProperties: PutIntoPlayProperties = {
        fate: 0,
        status: 'ordinary',
        controller: Players.Opponent,
        side: undefined
    };

    getDefaultSide(context: C): Player {
        return context.player.opponent ?? context.player;
    }

    constructor(
        properties: ((context: C) => PutIntoPlayProperties) | PutIntoPlayProperties,
        intoConflict = true
    ) {
        super(properties, intoConflict);
    }

    getPutIntoPlayPlayer(context: C): Player {
        return context.player.opponent ?? context.player;
    }
}
