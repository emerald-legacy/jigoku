import type { AbilityContext } from '../AbilityContext.js';
import type { MsgArg } from '../GameChat.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type { Event } from '../Events/Event.js';
import type Player from '../Player.js';

export type Result = {
    canCancel?: boolean;
    cancelled?: boolean;
};

/** A format with its args; the paid card or cards are `{0}`. */
export type CostMessage = [] | [string] | [string, MsgArg];

/** A context whose `costs` holds what this cost records there, once it is paid. */
export type CostContext<Results extends object, C extends AbilityContext = AbilityContext> = C & { costs: Partial<Results> };

/** `Results` is what paying the cost records on `context.costs`; its callbacks read and write it typed. */
export interface Cost<Results extends object = object> {
    canPay(context: CostContext<Results>): boolean;

    action?: GameAction;
    activePromptTitle?: string;

    selectCardName?(player: Player, cardName: string, context: AbilityContext): boolean;
    promptsPlayer?: boolean;
    dependsOn?: string;
    isPrintedFateCost?: boolean;
    isPlayCost?: boolean;
    canIgnoreForTargeting?: boolean;
    payFateCostToOpponent?: boolean;

    getActionName?(context: AbilityContext): string;
    getCostMessage?(context: CostContext<Results>): CostMessage;
    hasTargetsChosenByInitiatingPlayer?(context: AbilityContext): boolean;
    addEventsToArray?(events: Event[], context: AbilityContext, result?: Result): void;
    resolve?(context: CostContext<Results>, result: Result): void;
    payEvent?(context: CostContext<Results>): Event | Event[];
    pay?(context: CostContext<Results>): void;
    getReducedCost?(context: AbilityContext): number;
}
