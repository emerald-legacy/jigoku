import type { AbilityContext } from '../AbilityContext.js';
import type { Cost, Result } from './Cost.js';
import type { GameAction } from '../GameActions/GameAction.js';

export class GameActionCost implements Cost {
    constructor(public action: GameAction) {}

    getActionName(_context: AbilityContext): string {
        return this.action.name;
    }

    canPay(context: AbilityContext): boolean {
        return this.action.hasLegalTarget(context);
    }

    addEventsToArray(events: any[], context: AbilityContext, _result: Result): void {
        context.costs[this.action.name] = this.action.getProperties(context).target;
        this.action.addEventsToArray(events, context);
    }

    getCostMessage(context: AbilityContext): unknown[] {
        return this.action.getCostMessage(context) ?? [];
    }
}
