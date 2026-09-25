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

// ---- "Whenever" abilities ----

type WheneverCtx<Src extends BaseCard> = BaseCtx<Src>;

export interface Whenever<Src extends BaseCard> {
    announce(fn: ($message: MessageKit, ctx: WheneverCtx<Src>, util: Utils) => MessageResult): WheneverAnnounced<Src>;
    effects(fn: ($effect: EffectKit, ctx: WheneverCtx<Src>, util: Utils) => readonly EffectNode[]): Printable;
}

export interface WheneverAnnounced<Src extends BaseCard> {
    effects(fn: ($effect: EffectKit, ctx: WheneverCtx<Src>, util: Utils) => readonly EffectNode[]): Printable;
}

export interface Printable {
    addPrinted(): void;
}

/**
 * "If X, do Y" printed on a card without a timing word: the game checks the condition all the
 * time, and does Y when it is true.
 */
export class WheneverBuilder {
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

declare const subjectBrand: unique symbol;

/** What a constant ability applies to. Only `$subject` creates it. */
export interface Subject<T extends ModTarget> {
    readonly [subjectBrand]: T;
}

interface SubjectCardsOptions<Src extends BaseCard, C extends BaseCard> {
    /** Where the affected cards are. The default is the play area. */
    in?: Zone;
    controller?: (ctx: BaseCtx<Src>, util: Utils) => undefined | Player;
    filter?: (card: C, ctx: BaseCtx<Src>, util: Utils) => boolean;
}

function subject<T extends ModTarget>(props: Props): Subject<T> {
    return props as unknown as Subject<T>;
}

function kindList(kind: CardKindInput): readonly CardKind[] {
    return typeof kind === 'string' ? [kind] : kind;
}

function createSubjectKit<Src extends BaseCard>() {
    return {
        /** The card with the ability. */
        self: () => subject<'card'>({}),
        /** The character that this attachment is attached to. */
        attachedCharacter: () =>
            subject<'card'>({
                match: (card: GameObject, context: AbilityContext) => card === (context.source as DrawCard).parent,
                targetController: Players.Any
            }),
        cards: <const K extends CardKindInput>(kind: K, options: SubjectCardsOptions<Src, CardFor<K>> = {}) =>
            subject<'card'>({
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
        conflict: () => subject<'conflict'>({}),
        /** The player who controls the card with the ability. */
        you: () => subject<'player'>({ targetController: Players.Self }),
        opponent: () => subject<'player'>({ targetController: Players.Opponent }),
        eachPlayer: () => subject<'player'>({ targetController: Players.Any })
    };
}

export type SubjectKit<Src extends BaseCard> = ReturnType<typeof createSubjectKit<Src>>;

export interface Constant<Src extends BaseCard> {
    while(condition: (ctx: BaseCtx<Src>, util: Utils) => boolean): Constant<Src>;
    /** Where the card with the ability must be. The default depends on the card type. */
    activeFrom(zone: Zone): Constant<Src>;
    appliesTo<T extends ModTarget>(fn: ($subject: SubjectKit<Src>) => Subject<T>): ConstantSubject<T>;
}

export interface ConstantSubject<T extends ModTarget> {
    modifiers(fn: ($modifier: ModifierKit) => readonly Mod<T>[]): Printable;
}

/** A constant ability: an ability text without a timing word. */
export class ConstantBuilder {
    private readonly conditions: Fn[] = [];
    private zone: undefined | Zone;
    private appliesToFn: undefined | Fn;
    private modifiersFn: undefined | Fn;

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

    appliesTo(fn: Fn): this {
        this.appliesToFn = fn;
        return this;
    }

    modifiers(fn: Fn): this {
        this.modifiersFn = fn;
        return this;
    }

    addPrinted(): void {
        const subjectProps = (this.appliesToFn?.(createSubjectKit()) ?? {}) as Props;
        const mods = (this.modifiersFn?.(createModifierKit(this.gained)) ?? []) as Mod[];
        const conditions = this.conditions;

        const props: Props = { ...subjectProps, effect: modFactories(mods) };
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
