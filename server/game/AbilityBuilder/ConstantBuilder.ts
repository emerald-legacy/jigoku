import type { AbilityContext } from '../AbilityContext.js';
import AbilityDsl from '../abilitydsl.js';
import type BaseCard from '../BaseCard.js';
import { Location, Players } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { GameObject } from '../GameObject.js';
import type Player from '../Player.js';
import { EffectsAction } from './adapter/EffectsAction.js';
import { createEffectKit, nodeActions, type EffectKit, type EffectNode } from './kits/EffectKit.js';
import { formatted, messageKit, messageList, type MessageKit, type MessageResult } from './kits/MessageKit.js';
import {
    createModifierKit,
    modFactories,
    type GainedSupport,
    type Mod,
    type ModifierKit,
    type ModTarget
} from './kits/ModifierKit.js';
import type { Zone } from './TriggeredBuilder.js';
import type { BaseCtx, CardFor, CardKind, CardKindInput } from './types.js';
import { createUtils, type Utils } from './Utils.js';
import { createView, SlotTable } from './view.js';

type Fn = (...args: unknown[]) => unknown;
type Props = Record<string, unknown>;

const ZONE_LOCATION: Partial<Record<Zone, Location>> = {
    playArea: Location.PlayArea,
    provinces: Location.Provinces,
    conflictDiscardPile: Location.ConflictDiscardPile
};

const table = new SlotTable();
const view = (context: AbilityContext) => createView([context], table);

// ---- State checks ----

type StateCtx<Src extends BaseCard> = BaseCtx<Src>;

export interface StateCheck<Src extends BaseCard> {
    announce(fn: ($m: MessageKit, ctx: StateCtx<Src>, util: Utils) => MessageResult): StateCheckAnnounced<Src>;
    effects(fn: ($e: EffectKit, ctx: StateCtx<Src>, util: Utils) => readonly EffectNode[]): Printable;
}

export interface StateCheckAnnounced<Src extends BaseCard> {
    effects(fn: ($e: EffectKit, ctx: StateCtx<Src>, util: Utils) => readonly EffectNode[]): Printable;
}

export interface Printable {
    addPrinted(): void;
}

/**
 * "If X, do Y" printed on a card without a timing word: the game checks the condition all the
 * time, and does Y when it is true.
 */
export class StateCheckBuilder {
    private announceFn: undefined | Fn;
    private effectsFn: undefined | Fn;

    constructor(
        private readonly card: BaseCard,
        private readonly condition: Fn
    ) {}

    announce(fn: Fn): this {
        this.announceFn = fn;
        return this;
    }

    effects(fn: Fn): this {
        this.effectsFn = fn;
        return this;
    }

    addPrinted(): void {
        const effects = this.effectsFn;
        const announce = this.announceFn;

        const properties: Props = {
            condition: (context: AbilityContext) => Boolean(this.condition(view(context), createUtils(context))),
            gameAction: new EffectsAction((context) =>
                effects
                    ? nodeActions(
                          effects(createEffectKit(context), view(context), createUtils(context)) as EffectNode[]
                    )
                    : []
            )
        };
        if(announce) {
            properties.message = '{0}';
            properties.messageArgs = (context: AbilityContext) => {
                const [first] = messageList(announce(messageKit, view(context), createUtils(context)) as MessageResult);
                return first ? [formatted(context.game, first)] : [];
            };
        }
        this.card.persistentEffect({ effect: AbilityDsl.effects.delayedEffect(properties) });
    }
}

// ---- Constant abilities ----

declare const affectBrand: unique symbol;

/** What a constant ability affects. Only `$a` creates it. */
export interface Affect<T extends ModTarget> {
    readonly [affectBrand]: T;
}

interface AffectCardsOptions<Src extends BaseCard, C extends BaseCard> {
    /** Where the affected cards are. The default is the play area. */
    in?: Zone;
    controller?: (ctx: BaseCtx<Src>, util: Utils) => undefined | Player;
    filter?: (card: C, ctx: BaseCtx<Src>, util: Utils) => boolean;
}

function affect<T extends ModTarget>(props: Props): Affect<T> {
    return props as unknown as Affect<T>;
}

function kindList(kind: CardKindInput): readonly CardKind[] {
    return typeof kind === 'string' ? [kind] : kind;
}

function createAffectKit<Src extends BaseCard>() {
    return {
        /** The card with the ability. */
        self: () => affect<'card'>({}),
        /** The character that this attachment is attached to. */
        attachedCharacter: () =>
            affect<'card'>({
                match: (card: GameObject, context: AbilityContext) => card === (context.source as DrawCard).parent,
                targetController: Players.Any
            }),
        cards: <const K extends CardKindInput>(kind: K, options: AffectCardsOptions<Src, CardFor<K>> = {}) =>
            affect<'card'>({
                targetController: Players.Any,
                ...(options.in ? { targetLocation: ZONE_LOCATION[options.in] ?? Location.Any } : {}),
                match: (card: BaseCard, context: AbilityContext) => {
                    const ctx = view(context) as BaseCtx<Src>;
                    const util = createUtils(context);
                    return (
                        kindList(kind).includes(card.type as CardKind) &&
                        (!options.controller || card.controller === options.controller(ctx, util)) &&
                        (!options.filter || options.filter(card as CardFor<K>, ctx, util))
                    );
                }
            }),
        /** The current conflict. */
        conflict: () => affect<'conflict'>({}),
        /** The player who controls the card with the ability. */
        you: () => affect<'player'>({ targetController: Players.Self }),
        opponent: () => affect<'player'>({ targetController: Players.Opponent }),
        eachPlayer: () => affect<'player'>({ targetController: Players.Any })
    };
}

export type AffectKit<Src extends BaseCard> = ReturnType<typeof createAffectKit<Src>>;

export interface Constant<Src extends BaseCard> {
    while(condition: (ctx: BaseCtx<Src>, util: Utils) => boolean): Constant<Src>;
    /** Where the card with the ability must be. The default depends on the card type. */
    activeFrom(zone: Zone): Constant<Src>;
    affects<T extends ModTarget>(fn: ($a: AffectKit<Src>) => Affect<T>): ConstantAffects<T>;
}

export interface ConstantAffects<T extends ModTarget> {
    effects(fn: ($mod: ModifierKit) => readonly Mod<T>[]): Printable;
}

/** A constant ability: an ability text without a timing word. */
export class ConstantBuilder {
    private readonly conditions: Fn[] = [];
    private zone: undefined | Zone;
    private affectsFn: undefined | Fn;
    private effectsFn: undefined | Fn;

    constructor(
        private readonly card: BaseCard,
        private readonly gained: GainedSupport,
        /** A constant ability that a keyword gives (composure, dire). It stays under "loses all non-keyword abilities". */
        private readonly fromKeyword = false
    ) {}

    while(condition: Fn): this {
        this.conditions.push(condition);
        return this;
    }

    activeFrom(zone: Zone): this {
        this.zone = zone;
        return this;
    }

    affects(fn: Fn): this {
        this.affectsFn = fn;
        return this;
    }

    effects(fn: Fn): this {
        this.effectsFn = fn;
        return this;
    }

    addPrinted(): void {
        const target = (this.affectsFn?.(createAffectKit()) ?? {}) as Props;
        const mods = (this.effectsFn?.(createModifierKit(this.gained)) ?? []) as Mod[];
        const conditions = this.conditions;

        const props: Props = { ...target, effect: modFactories(mods) };
        if(conditions.length > 0) {
            props.condition = (context: AbilityContext) =>
                conditions.every((condition) => condition(view(context), createUtils(context)));
        }
        if(this.zone) {
            props.location = ZONE_LOCATION[this.zone] ?? Location.Any;
        }
        if(this.fromKeyword) {
            props.isKeywordEffect = true;
        }
        this.card.persistentEffect(props as never);
    }
}
