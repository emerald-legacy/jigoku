import type { AbilityContext } from '../AbilityContext.js';
import type { GameAction, GameActionProperties } from './GameAction.js';
import type { EventName } from '../Constants.js';
import { SequentialContextAction } from './SequentialContextAction.js';

export class SequentialAction<C extends AbilityContext = AbilityContext> extends SequentialContextAction<C> {
    constructor(gameActions: GameAction<GameActionProperties, EventName, C>[]) {
        super({ gameActions: gameActions });
    }
}
