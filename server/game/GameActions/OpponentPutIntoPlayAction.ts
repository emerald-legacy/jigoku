import { AbilityContext } from '../AbilityContext.js';
import { Players } from '../Constants.js';
import type Player from '../player.js';
import { PutIntoPlayAction, PutIntoPlayProperties } from './PutIntoPlayAction.js';

export type OpponentPutIntoPlayProperties = PutIntoPlayProperties;

export class OpponentPutIntoPlayAction extends PutIntoPlayAction {
    defaultProperties: PutIntoPlayProperties = {
        fate: 0,
        status: 'ordinary',
        controller: Players.Opponent,
        side: undefined
    };

    getDefaultSide(context: AbilityContext): Player {
        return context.player.opponent ?? context.player;
    }

    constructor(
        properties: ((context: AbilityContext) => PutIntoPlayProperties) | PutIntoPlayProperties,
        intoConflict = true
    ) {
        super(properties, intoConflict);
    }

    getPutIntoPlayPlayer(context: AbilityContext): Player {
        return context.player.opponent ?? context.player;
    }
}
