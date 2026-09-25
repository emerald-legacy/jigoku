import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import { CardType, Location, Players, TargetMode } from '../../Constants.js';
import type Player from '../../Player.js';
import type { Utils } from '../Utils.js';
import type { CardFor, CardKind, CardKindInput, FilterCtx, PlayerRef, State } from '../types.js';

declare const targetResult: unique symbol;

/** What the compiler gives to a target spec. */
export interface TargetEnv {
    /** The owner of the ability, for the parts of the spec that must be known when the ability is built. */
    owner: Player;
    view(context: AbilityContext): unknown;
    util(context: AbilityContext): Utils;
}

/** One old-style target that a spec produces. */
export interface LegacyTarget {
    name: string;
    kind: 'card' | 'select';
    props: Record<string, unknown>;
}

/** One slot of `.targets()`. Only `$t` creates it. */
export abstract class TargetSpec<R> {
    declare readonly [targetResult]: R;

    abstract compile(name: string, env: TargetEnv): LegacyTarget[];
    abstract read(context: AbilityContext, name: string): unknown;
    /** The cards that this slot chose, for the legality check of the effects. */
    chosenCards(context: AbilityContext, name: string): BaseCard[] {
        const value = this.read(context, name);
        if(Array.isArray(value)) {
            return value.filter((item): item is BaseCard => item instanceof Object && 'uuid' in item);
        }
        return value instanceof Object && 'uuid' in value ? [value as BaseCard] : [];
    }
}

interface CardChoiceOptions<S extends State, C extends BaseCard> {
    /** The cards to choose from. Leave it out to choose cards in play. */
    from?: (ctx: FilterCtx<S>, util: Utils) => readonly BaseCard[];
    controller?: PlayerRef<S>;
    chooser?: PlayerRef<S>;
    prompt?: string;
    hideIfNoLegalTargets?: boolean;
    filter?: (card: C, ctx: FilterCtx<S>, util: Utils) => boolean;
}

type Count<S extends State> =
    { exactly: number } | { upTo: number | ((ctx: FilterCtx<S>, util: Utils) => number) } | { unlimited: true };

type Cardinality = 'single' | 'optional' | 'many';

function resolveRef<S extends State>(ref: PlayerRef<S>, view: unknown, util: Utils): undefined | Player {
    return typeof ref === 'function' ? ref(view as FilterCtx<S>, util) : ref;
}

function relativePlayer(context: AbilityContext, player: undefined | Player): Players {
    return player === context.player.opponent ? Players.Opponent : Players.Self;
}

function defaultLocation(kinds: readonly CardKind[]): undefined | Location {
    if(kinds.every((kind) => kind === 'province' || kind === 'holding')) {
        return Location.Provinces;
    }
    if(kinds.every((kind) => kind === 'role')) {
        return Location.Role;
    }
    return undefined;
}

const ALL_KINDS: readonly CardKind[] = [
    'character',
    'attachment',
    'holding',
    'event',
    'province',
    'stronghold',
    'role'
];

class CardTargetSpec<R> extends TargetSpec<R> {
    constructor(
        private readonly kinds: readonly CardKind[],
        private readonly cardinality: Cardinality,
        private readonly options: CardChoiceOptions<State, BaseCard>,
        private readonly count?: Count<State>
    ) {
        super();
    }

    compile(name: string, env: TargetEnv): LegacyTarget[] {
        return [{ name, kind: 'card', props: this.legacyProps(env) }];
    }

    legacyProps(env: TargetEnv): Record<string, unknown> {
        const { from, controller, chooser, prompt, hideIfNoLegalTargets, filter } = this.options;
        const props: Record<string, unknown> = {
            cardType: this.kinds.map((kind) => kind as CardType),
            cardCondition: (card: BaseCard, context: AbilityContext) => {
                const view = env.view(context);
                const util = env.util(context);
                if(from && !from(view as FilterCtx<State>, util).includes(card)) {
                    return false;
                }
                if(controller !== undefined && card.controller !== resolveRef(controller, view, util)) {
                    return false;
                }
                return !filter || filter(card, view as FilterCtx<State>, util);
            }
        };

        const location = from ? Location.Any : defaultLocation(this.kinds);
        if(location) {
            props.location = location;
        }
        if(chooser !== undefined) {
            props.player = (context: AbilityContext) =>
                relativePlayer(context, resolveRef(chooser, env.view(context), env.util(context)));
        }
        if(prompt) {
            props.activePromptTitle = prompt;
        }
        if(hideIfNoLegalTargets) {
            props.hideIfNoLegalTargets = true;
        }
        if(this.cardinality === 'optional') {
            props.optional = true;
        }
        Object.assign(props, this.modeProps(env));
        return props;
    }

    private modeProps(env: TargetEnv): Record<string, unknown> {
        const count = this.count;
        if(!count) {
            return {};
        }
        if('exactly' in count) {
            return { mode: TargetMode.Exactly, numCards: count.exactly };
        }
        if('upTo' in count) {
            const upTo = count.upTo;
            return typeof upTo === 'function'
                ? {
                    mode: TargetMode.UpToVariable,
                    numCardsFunc: (context: AbilityContext) =>
                        upTo(env.view(context) as FilterCtx<State>, env.util(context))
                }
                : { mode: TargetMode.UpTo, numCards: upTo };
        }
        return { mode: TargetMode.Unlimited };
    }

    read(context: AbilityContext, name: string): unknown {
        const value = context.targets[name];
        if(this.cardinality === 'many') {
            if(value === undefined) {
                return [];
            }
            return Array.isArray(value) ? value : [value];
        }
        if(Array.isArray(value)) {
            return value[0];
        }
        return value;
    }
}

class SelectTargetSpec<R> extends TargetSpec<R> {
    constructor(
        private readonly options: Record<string, string>,
        private readonly chooser: PlayerRef<State>,
        private readonly prompt: undefined | string
    ) {
        super();
    }

    compile(name: string, env: TargetEnv): LegacyTarget[] {
        const chooser = this.chooser;
        const choices: Record<string, unknown> = {};
        for(const label of Object.values(this.options)) {
            choices[label] = () => true;
        }

        const props: Record<string, unknown> = { mode: TargetMode.Select, choices };
        if(chooser !== undefined) {
            props.player = (context: AbilityContext) =>
                relativePlayer(context, resolveRef(chooser, env.view(context), env.util(context)));
        }
        if(this.prompt) {
            props.activePromptTitle = this.prompt;
        }
        return [{ name, kind: 'select', props }];
    }

    read(context: AbilityContext, name: string): unknown {
        const label = context.selects[name]?.choice;
        return Object.entries(this.options).find(([, value]) => value === label)?.[0];
    }

    chosenCards(): BaseCard[] {
        return [];
    }
}

interface InOrderChoice<R> {
    readonly player: Player;
    readonly choice: R;
}

class InPlayerOrderSpec<R> extends TargetSpec<readonly InOrderChoice<R>[]> {
    constructor(private readonly build: (player: Player, $t: TargetKit<State>) => TargetSpec<R>) {
        super();
    }

    private playerAt(context: AbilityContext, index: number): undefined | Player {
        return context.game.getPlayersInFirstPlayerOrder()[index];
    }

    private specFor(context: AbilityContext, index: number, fallback: Player): CardTargetSpec<R> {
        const spec = this.build(this.playerAt(context, index) ?? fallback, targetKit as TargetKit<State>);
        if(!(spec instanceof CardTargetSpec)) {
            throw new Error('Ability builder: inPlayerOrder supports only card targets');
        }
        return spec;
    }

    compile(name: string, env: TargetEnv): LegacyTarget[] {
        const spec = this.build(env.owner, targetKit as TargetKit<State>);
        if(!(spec instanceof CardTargetSpec)) {
            throw new Error('Ability builder: inPlayerOrder supports only card targets');
        }
        // The parts of the spec that do not depend on the player.
        const template = spec.legacyProps(env);
        return [0, 1].map((index) => {
            const props: Record<string, unknown> = { ...template };
            const chooser = (context: AbilityContext) => this.playerAt(context, index);
            props.player = (context: AbilityContext) => relativePlayer(context, chooser(context));
            props.cardCondition = (card: BaseCard, context: AbilityContext) => {
                const player = chooser(context);
                if(!player) {
                    return false;
                }
                const condition = this.specFor(context, index, player).legacyProps(env).cardCondition as (
                    card: BaseCard,
                    context: AbilityContext
                ) => boolean;
                return condition(card, context);
            };
            return { name: `${name}#${index}`, kind: 'card', props };
        });
    }

    read(context: AbilityContext, name: string): unknown {
        const choices: InOrderChoice<unknown>[] = [];
        for(const [index, player] of context.game.getPlayersInFirstPlayerOrder().entries()) {
            const choice = this.specFor(context, index, player).read(context, `${name}#${index}`);
            if(choice !== undefined) {
                choices.push({ player, choice });
            }
        }
        return choices;
    }

    chosenCards(context: AbilityContext, name: string): BaseCard[] {
        return (this.read(context, name) as InOrderChoice<unknown>[]).flatMap(({ choice }) =>
            choice instanceof Object && 'uuid' in choice ? [choice as BaseCard] : []
        );
    }
}

function kindsOf(kind: CardKindInput): readonly CardKind[] {
    return typeof kind === 'string' ? [kind] : kind;
}

export interface TargetKit<S extends State> {
    card<const K extends CardKindInput>(kind: K, options?: CardChoiceOptions<S, CardFor<K>>): TargetSpec<CardFor<K>>;
    optionalCard<const K extends CardKindInput>(
        kind: K,
        options?: CardChoiceOptions<S, CardFor<K>>
    ): TargetSpec<undefined | CardFor<K>>;
    cards<const K extends CardKindInput>(
        kind: K,
        options: CardChoiceOptions<S, CardFor<K>> & Count<S>
    ): TargetSpec<CardFor<K>[]>;
    /** Any card type. */
    anyCard(options?: CardChoiceOptions<S, BaseCard>): TargetSpec<BaseCard>;
    /** Labels only. The effects branch on the typed key. */
    select<const O extends Record<string, string>>(options: {
        options: O;
        chooser?: PlayerRef<S>;
        prompt?: string;
    }): TargetSpec<keyof O & string>;
    /** Each player in turn order chooses. */
    inPlayerOrder<R>(
        build: (player: Player, $t: TargetKit<S>) => TargetSpec<R>
    ): TargetSpec<readonly InOrderChoice<R>[]>;
}

function countOf(options: object): Count<State> {
    if('exactly' in options) {
        return { exactly: options.exactly as number };
    }
    if('upTo' in options) {
        return { upTo: options.upTo as number | ((ctx: FilterCtx<State>, util: Utils) => number) };
    }
    return { unlimited: true };
}

export const targetKit: TargetKit<State> = {
    card: (kind, options = {}) =>
        new CardTargetSpec(kindsOf(kind), 'single', options as CardChoiceOptions<State, BaseCard>) as never,
    optionalCard: (kind, options = {}) =>
        new CardTargetSpec(kindsOf(kind), 'optional', options as CardChoiceOptions<State, BaseCard>) as never,
    cards: (kind, options) =>
        new CardTargetSpec(
            kindsOf(kind),
            'many',
            options as CardChoiceOptions<State, BaseCard>,
            countOf(options)
        ) as never,
    anyCard: (options = {}) => new CardTargetSpec(ALL_KINDS, 'single', options) as never,
    select: (options) => new SelectTargetSpec(options.options, options.chooser, options.prompt) as never,
    inPlayerOrder: (build) =>
        new InPlayerOrderSpec(build as (player: Player, $t: TargetKit<State>) => TargetSpec<never>) as never
};
