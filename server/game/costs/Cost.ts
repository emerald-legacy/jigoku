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

export type CostContext<Results extends object, Context extends AbilityContext = AbilityContext> = Context & { costs: Partial<Results> };

/** `Results` is what paying the cost records on `context.costs`; its callbacks read and write it typed. */
export interface Cost<Results extends object = object, Context extends AbilityContext = AbilityContext> {
    canPay(context: CostContext<Results, Context>): boolean;

    action?: GameAction;
    activePromptTitle?: string;

    promptsPlayer?: boolean;
    dependsOn?: string;
    isPrintedFateCost?: boolean;
    isPlayCost?: boolean;

    getActionName?(context: AbilityContext): string;
    getCostMessage?(context: CostContext<Results, Context>): CostMessage;
    hasTargetsChosenByInitiatingPlayer?(context: AbilityContext): boolean;
    addEventsToArray?(events: Event[], context: AbilityContext, result?: Result): void;
    resolve?(context: CostContext<Results, Context>, result: Result): void;
    payEvent?(context: CostContext<Results, Context>): Event | Event[];
    pay?(context: CostContext<Results, Context>): void;
    getReducedCost?(context: AbilityContext): number;
}
