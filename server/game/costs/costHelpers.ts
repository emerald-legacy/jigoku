import * as GameActions from '../GameActions/GameActions.js';
import { CardGameAction } from '../GameActions/CardGameAction.js';
import { SelectCardProperties } from '../GameActions/SelectCardAction.js';
import type { CardType, TargetMode } from '../Constants.js';
import type { CardOfType } from '../types/CardOfType.js';
import type { Cost } from './Cost.js';
import { MetaActionCost } from './MetaActionCost.js';

export type SelectCostProperties = Omit<SelectCardProperties, 'gameAction'>;

/** A select cost's properties, with its card type and mode kept for the type of its result. */
export type TypedSelectCostProperties<K, M> = Omit<SelectCostProperties, 'cardType' | 'mode'> & { cardType?: K; mode?: M };

type MultiCardMode = TargetMode.Exactly | TargetMode.ExactlyVariable | TargetMode.MaxStat | TargetMode.Unlimited | TargetMode.UpTo | TargetMode.UpToVariable;

/** A cost on several cards holds them all once paid, but one candidate at a time while they are chosen. */
type ChosenForCost<K, M> = [M] extends [MultiCardMode] ? CardOfType<K> | CardOfType<K>[] : CardOfType<K>;

/** What a select cost stores: the chosen card under the action's name, and a snapshot of it. */
export type SelectCostResult<N extends string, K, M> =
    { [P in N]: ChosenForCost<K, M> } & { [P in `${N}StateWhenChosen`]: ReturnType<CardOfType<K>['createSnapshot']> };

const isCardTypeList = (cardType: CardType | readonly CardType[]): cardType is readonly CardType[] => Array.isArray(cardType);

export function getSelectCost<const N extends string, K extends CardType | readonly CardType[] | undefined, M extends TargetMode | undefined>(
    name: N,
    action: CardGameAction,
    properties: TypedSelectCostProperties<K, M> | undefined,
    activePromptTitle: string
): Cost<SelectCostResult<N, K, M>> {
    if(action.name !== name) {
        throw new Error(`the ${action.name} cost stores its result under '${action.name}', not '${name}'`);
    }
    const { cardType, ...rest } = properties ?? {};
    return new MetaActionCost(
        GameActions.selectCard({
            gameAction: action,
            ...rest,
            ...(cardType !== undefined ? { cardType: isCardTypeList(cardType) ? [...cardType] : cardType } : {})
        }),
        activePromptTitle
    );
}
