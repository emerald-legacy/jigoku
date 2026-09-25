import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import { CardType } from '../../Constants.js';
import type { Cost } from '../../costs/Cost.js';
import type { Utils } from '../Utils.js';
import type { CardFor, CardKindInput, FilterCtx, State } from '../types.js';

declare const costResult: unique symbol;

/** What the compiler gives to a cost spec. */
export interface CostEnv {
    view(context: AbilityContext): unknown;
    util(context: AbilityContext): Utils;
}

/** One slot of `.costs()`. Only `$cost` creates it. */
export class CostSpec<R> {
    declare readonly [costResult]: R;

    constructor(
        readonly compile: (env: CostEnv) => Cost,
        /** Where the old cost stores its result in `context.costs`. */
        readonly key: undefined | string
    ) {}

    read(context: AbilityContext): unknown {
        return this.key === undefined ? undefined : context.costs[this.key];
    }
}

interface CardCostOptions<S extends State, C extends BaseCard> {
    filter?: (card: C, ctx: FilterCtx<S>, util: Utils) => boolean;
}

function kinds(kind: CardKindInput): CardType[] {
    return (typeof kind === 'string' ? [kind] : [...kind]) as CardType[];
}

function selectProps(kind: CardKindInput, options: CardCostOptions<State, BaseCard>, env: CostEnv) {
    const filter = options.filter;
    return {
        cardType: kinds(kind),
        cardCondition: (card: BaseCard, context: AbilityContext) =>
            !filter || filter(card, env.view(context) as FilterCtx<State>, env.util(context))
    };
}

export interface CostKit<S extends State> {
    bowSelf(): CostSpec<void>;
    dishonor<const K extends CardKindInput>(kind: K, options?: CardCostOptions<S, CardFor<K>>): CostSpec<CardFor<K>>;
    sacrifice<const K extends CardKindInput>(kind: K, options?: CardCostOptions<S, CardFor<K>>): CostSpec<CardFor<K>>;
    bow<const K extends CardKindInput>(kind: K, options?: CardCostOptions<S, CardFor<K>>): CostSpec<CardFor<K>>;
    payHonor(amount?: number): CostSpec<void>;
    /** "name a card": the result is the name. */
    nameCard(): CostSpec<string>;
}

export const costKit: CostKit<State> = {
    bowSelf: () => new CostSpec(() => AbilityDsl.costs.bowSelf(), undefined),
    dishonor: (kind, options = {}) =>
        new CostSpec(
            (env) => AbilityDsl.costs.dishonor(selectProps(kind, options as CardCostOptions<State, BaseCard>, env)),
            'dishonor'
        ) as never,
    sacrifice: (kind, options = {}) =>
        new CostSpec(
            (env) => AbilityDsl.costs.sacrifice(selectProps(kind, options as CardCostOptions<State, BaseCard>, env)),
            'sacrifice'
        ) as never,
    bow: (kind, options = {}) =>
        new CostSpec(
            (env) => AbilityDsl.costs.bow(selectProps(kind, options as CardCostOptions<State, BaseCard>, env)),
            'bow'
        ) as never,
    payHonor: (amount = 1) => new CostSpec(() => AbilityDsl.costs.payHonor(amount), undefined),
    nameCard: () => new CostSpec(() => AbilityDsl.costs.nameCard(), 'nameCardCost')
};
