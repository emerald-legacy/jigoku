import type { AbilityContext } from '../AbilityContext.js';
import type { GameAction, GameActionProperties } from './GameAction.js';
import type { EventName } from '../Constants.js';
import { MultipleContextGameAction } from './MultipleContextGameAction.js';

export class MultipleGameAction<C extends AbilityContext = AbilityContext> extends MultipleContextGameAction<C> {
    constructor(gameActions: GameAction<GameActionProperties, EventName, C>[]) {
        super({ gameActions: gameActions });
    }
}
