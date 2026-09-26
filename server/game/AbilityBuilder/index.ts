import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { TriggeredCompiler } from './adapter/compileTriggered.js';
import { addPlayRestriction, ConstantBuilder, WheneverBuilder, type Constant, type Whenever } from './ConstantBuilder.js';
import type { GainedSupport } from './kits/ModifierKit.js';
import { AbilityType } from '../Constants.js';
import { limitKit, type FinishOptions } from './kits/LimitKit.js';
import type { BaseCtx } from './types.js';
import type { Utils } from './Utils.js';
import {
    TriggeredBuilder,
    type AbilityEntry,
    type AbilityKind,
    type AbilitySpec,
    type Finish
} from './TriggeredBuilder.js';

function register(card: BaseCard, spec: AbilitySpec, limits: FinishOptions): void {
    const props = new TriggeredCompiler(card, spec).compile(limits) as never;
    switch(spec.kind) {
        case 'action':
            card.action(props);
            return;
        case 'reaction':
            card.reaction(props);
            return;
        case 'forcedReaction':
            card.forcedReaction(props);
            return;
        case 'interrupt':
            card.interrupt(props);
            return;
        case 'wouldInterrupt':
            card.wouldInterrupt(props);
            return;
        case 'forcedInterrupt':
            card.forcedInterrupt(props);
            return;
        case 'duelChallenge':
            (card as DrawCard).duelChallenge(props);
            return;
        case 'duelFocus':
            (card as DrawCard).duelFocus(props);
            return;
        case 'duelStrike':
            (card as DrawCard).duelStrike(props);
            return;
    }
}

function createEntry<Src extends BaseCard, F extends Finish>(
    finish: ConstructorParameters<typeof TriggeredBuilder>[1]
): AbilityEntry<Src, F> {
    const start = (kind: AbilityKind, extra: Partial<AbilitySpec> = {}) =>
        new TriggeredBuilder(kind, finish, extra) as never;

    return {
        action: () => start('action'),
        conflictAction: () => start('action', { conflict: {} }),
        militaryConflictAction: () => start('action', { conflict: { type: 'military' } }),
        politicalConflictAction: () => start('action', { conflict: { type: 'political' } }),

        reaction: (when) => start('reaction', { when: when }),
        forcedReaction: (when) => start('forcedReaction', { when: when }),
        interrupt: (when) => start('interrupt', { when: when }),
        wouldInterrupt: (when) => start('wouldInterrupt', { when: when }),
        forcedInterrupt: (when) => start('forcedInterrupt', { when: when }),

        duelChallenge: () => start('duelChallenge'),
        duelFocus: () => start('duelFocus'),
        duelStrike: () => start('duelStrike')
    };
}

const ABILITY_TYPE: Record<AbilityKind, AbilityType> = {
    action: AbilityType.Action,
    reaction: AbilityType.Reaction,
    forcedReaction: AbilityType.ForcedReaction,
    interrupt: AbilityType.Interrupt,
    wouldInterrupt: AbilityType.WouldInterrupt,
    forcedInterrupt: AbilityType.ForcedInterrupt,
    duelChallenge: AbilityType.DuelReaction,
    duelFocus: AbilityType.DuelReaction,
    duelStrike: AbilityType.DuelReaction
};

interface GainedData {
    spec: AbilitySpec;
    limits: FinishOptions;
}

/** Compiles gained abilities with the card that gives them, for the parts that must be known when they are built. */
function gainedCompiler(card: BaseCard): GainedSupport {
    return {
        entry: gainedEntry(),
        compile(gained) {
            const { spec, limits } = gained as unknown as GainedData;
            if(spec.kind.startsWith('duel')) {
                throw new Error('Ability builder: a gained duel ability is not supported yet');
            }
            return { type: ABILITY_TYPE[spec.kind], props: new TriggeredCompiler(card, spec, true).compile(limits) };
        }
    };
}

function gainedEntry<Src extends BaseCard = DrawCard>(): AbilityEntry<Src, 'gained'> {
    return createEntry<Src, 'gained'>({
        limitKit,
        build: (spec, limits) => ({ spec, limits })
    });
}

export interface PrintedAbilityEntry<Src extends BaseCard> extends AbilityEntry<Src, 'printed'> {
    /** A constant ability: an ability text without a timing word. */
    constant(): Constant<Src>;
    /** "Composure - ...": a constant ability while you have composure. */
    composure(): Constant<Src>;
    /** "Dire - ...": a constant ability while this card has no fate. */
    dire(): Constant<Src>;
    /** "If X, do Y" without a timing word: the game checks it all the time. */
    whenever(condition: (ctx: BaseCtx<Src>, util: Utils) => boolean): Whenever<Src>;
    /** "Play only if X". */
    playOnlyIf(condition: (ctx: BaseCtx<Src>, util: Utils) => boolean): void;
}

/** The entry point for the printed abilities of a card: `this.ability`. */
export function printedAbilityEntry<Src extends BaseCard>(card: Src): PrintedAbilityEntry<Src> {
    return {
        ...createEntry<Src, 'printed'>({ limitKit, register: (spec, limits) => register(card, spec, limits) }),
        whenever: (condition) => new WheneverBuilder(card, condition as never) as never,
        playOnlyIf: (condition) => addPlayRestriction(card, condition as never),
        constant: () => new ConstantBuilder(card, gainedCompiler(card)) as never,
        composure: () =>
            new ConstantBuilder(card, gainedCompiler(card), true).while((ctx) =>
                (ctx as BaseCtx<Src>).player.hasComposure()
            ) as never,
        dire: () =>
            new ConstantBuilder(card, gainedCompiler(card), true).while((ctx) =>
                ((ctx as BaseCtx<Src>).source as unknown as DrawCard).isDire()
            ) as never
    };
}
