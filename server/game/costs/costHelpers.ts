import type { CardGameAction } from '../GameActions/CardGameAction.js';
import { eraseSelectCardsProperties, SelectCardAction, type SelectCardsProperties } from '../GameActions/SelectCardAction.js';
import type { TargetMode } from '../Constants.js';
import type { CardOfType, CardTypes } from '../types/CardOfType.js';
import type { Cost } from './Cost.js';
import type { MultiCardMode } from '../CardSelector.js';
import type { AbilityContext } from '../AbilityContext.js';
import { MetaActionCost } from './MetaActionCost.js';

/** A select cost's properties, with its card type and mode kept for the type of its result. Its `cardCondition` gets the context of the ability paying the cost. */
export type TypedSelectCostProperties<Types extends CardTypes, Mode extends TargetMode | undefined, Context extends AbilityContext = AbilityContext> =
    Omit<SelectCardsProperties<Context, Types>, 'gameAction' | 'mode'> & { mode?: Mode };

/** A cost on several cards holds them all once paid, but one candidate at a time while they are chosen. */
type ChosenForCost<Types, Mode> = [Mode] extends [MultiCardMode] ? CardOfType<Types> | CardOfType<Types>[] : CardOfType<Types>;

/** What a select cost stores: the chosen card under the action's name, and a snapshot of it. */
export type SelectCostResult<Name extends string, Types, Mode> =
    { [Key in Name]: ChosenForCost<Types, Mode> } & { [Key in `${Name}StateWhenChosen`]: ReturnType<CardOfType<Types>['createSnapshot']> };

export function getSelectCost<const Name extends string, Types extends CardTypes, Mode extends TargetMode | undefined, Context extends AbilityContext>(
    name: Name,
    action: CardGameAction,
    properties: TypedSelectCostProperties<Types, Mode, Context> | undefined,
    activePromptTitle: string
): Cost<SelectCostResult<Name, Types, Mode>, Context> {
    if(action.name !== name) {
        throw new Error(`the ${action.name} cost stores its result under '${action.name}', not '${name}'`);
    }
    return new MetaActionCost(new SelectCardAction(eraseSelectCardsProperties({ gameAction: action, ...properties })), activePromptTitle);
}
