import { CardGameAction } from '../GameActions/CardGameAction.js';
import { eraseSelectCardsProperties, SelectCardAction, type SelectCardsProperties } from '../GameActions/SelectCardAction.js';
import type { TargetMode } from '../Constants.js';
import type { CardOfType, CardTypes } from '../types/CardOfType.js';
import type { Cost } from './Cost.js';
import type { MultiCardMode } from '../CardSelector.js';
import type { AbilityContext } from '../AbilityContext.js';
import { MetaActionCost } from './MetaActionCost.js';

/** A select cost's properties, with its card type and mode kept for the type of its result. Its `cardCondition` gets the context of the ability paying the cost. */
export type TypedSelectCostProperties<K extends CardTypes, M extends TargetMode | undefined, C extends AbilityContext = AbilityContext> =
    Omit<SelectCardsProperties<C, K>, 'gameAction' | 'mode'> & { mode?: M };

/** A cost on several cards holds them all once paid, but one candidate at a time while they are chosen. */
type ChosenForCost<K, M> = [M] extends [MultiCardMode] ? CardOfType<K> | CardOfType<K>[] : CardOfType<K>;

/** What a select cost stores: the chosen card under the action's name, and a snapshot of it. */
export type SelectCostResult<N extends string, K, M> =
    { [P in N]: ChosenForCost<K, M> } & { [P in `${N}StateWhenChosen`]: ReturnType<CardOfType<K>['createSnapshot']> };

export function getSelectCost<const N extends string, K extends CardTypes, M extends TargetMode | undefined, C extends AbilityContext>(
    name: N,
    action: CardGameAction,
    properties: TypedSelectCostProperties<K, M, C> | undefined,
    activePromptTitle: string
): Cost<SelectCostResult<N, K, M>, C> {
    if(action.name !== name) {
        throw new Error(`the ${action.name} cost stores its result under '${action.name}', not '${name}'`);
    }
    return new MetaActionCost(new SelectCardAction(eraseSelectCardsProperties({ gameAction: action, ...properties })), activePromptTitle);
}
