import { AbilityContext } from '../AbilityContext.js';
import { Players } from '../Constants.js';
import { PutIntoPlayAction, PutIntoPlayProperties } from './PutIntoPlayAction.js';

export type OpponentPutIntoPlayProperties = PutIntoPlayProperties;

export class OpponentPutIntoPlayAction extends PutIntoPlayAction {
    defaultProperties: PutIntoPlayProperties = {
        fate: 0,
        status: 'ordinary',
        controller: Players.Opponent,
        side: null
    };

    getDefaultSide(context: AbilityContext) {
        return context.player.opponent;
    }

    constructor(
        properties: ((context: AbilityContext) => PutIntoPlayProperties) | PutIntoPlayProperties,
        intoConflict = true
    ) {
        super(properties, intoConflict);
    }

    getPutIntoPlayPlayer(context) {
        return context.player.opponent;
    }
}
