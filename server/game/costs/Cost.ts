import type { AbilityContext } from '../AbilityContext.js';
import type { MsgArg } from '../GameChat.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type { Event } from '../Events/Event.js';

export type Result = {
    canCancel?: boolean;
    cancelled?: boolean;
};

/** A format with its args; the paid card or cards are `{0}`. */
export type CostMessage = [] | [string] | [string, MsgArg];

export type CostContext<Results extends object, C extends AbilityContext = AbilityContext> = C & { costs: Partial<Results> };

/** `Results` is what paying the cost records on `context.costs`; its callbacks read and write it typed. */
export interface Cost<Results extends object = object, C extends AbilityContext = AbilityContext> {
    canPay(context: CostContext<Results, C>): boolean;

    action?: GameAction;
    activePromptTitle?: string;

    promptsPlayer?: boolean;
    dependsOn?: string;
    isPrintedFateCost?: boolean;
    isPlayCost?: boolean;
    payFateCostToOpponent?: boolean;

    getActionName?(context: AbilityContext): string;
    getCostMessage?(context: CostContext<Results, C>): CostMessage;
    hasTargetsChosenByInitiatingPlayer?(context: AbilityContext): boolean;
    addEventsToArray?(events: Event[], context: AbilityContext, result?: Result): void;
    resolve?(context: CostContext<Results, C>, result: Result): void;
    payEvent?(context: CostContext<Results, C>): Event | Event[];
    pay?(context: CostContext<Results, C>): void;
    getReducedCost?(context: AbilityContext): number;
}
