import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import { AbilityType, CharacterStatus, PlayType } from '../../Constants.js';
import type DrawCard from '../../DrawCard.js';
import type { EffectFactory } from '../../Effects/EffectBuilder.js';
import type { AbilityEntry, GainedAbility } from '../TriggeredBuilder.js';

declare const modBrand: unique symbol;

/** What a modifier applies to. */
export type ModTarget = 'card' | 'player' | 'conflict';

/** One modifier. Only `$mod` creates it. */
export type Mod<T extends ModTarget = ModTarget> = EffectFactory & { readonly [modBrand]: T };

export function modFactories(mods: readonly Mod[]): EffectFactory[] {
    return mods as readonly EffectFactory[] as EffectFactory[];
}

/** RRG "Immune": the sources of effects that a card can be immune to. */
export type ImmunitySource =
    | 'cardEffects'
    | 'ringEffects'
    | 'cardAndRingEffects'
    | 'events'
    | 'opponentsCardEffects'
    | 'opponentsRingEffects'
    | 'opponentsCardAndRingEffects'
    | 'opponentsEvents'
    | 'opponentsTriggeredAbilities'
    | 'opponentsCardAbilities';

/** How the builder creates gained abilities and turns them into the props of `gainAbility`. */
export interface GainedSupport {
    entry: AbilityEntry<DrawCard, 'gained'>;
    compile(gained: GainedAbility<BaseCard>): { type: AbilityType; props: object };
}

const card = (factory: EffectFactory) => factory as Mod<'card'>;
const player = (factory: EffectFactory) => factory as Mod<'player'>;
const conflict = (factory: EffectFactory) => factory as Mod<'conflict'>;

export function createModifierKit(gained: GainedSupport) {
    return {
        // ---- Card modifiers ----
        blank: () => card(AbilityDsl.effects.blank()),
        military: (amount: number) => card(AbilityDsl.effects.modifyMilitarySkill(amount)),
        political: (amount: number) => card(AbilityDsl.effects.modifyPoliticalSkill(amount)),
        doesNotBow: () => card(AbilityDsl.effects.doesNotBow()),
        cannotBeReadiedByCardEffects: () =>
            card(AbilityDsl.effects.cardCannot({ cannot: 'ready', restricts: 'cardEffects' })),
        cannotTriggerAbilities: () => card(AbilityDsl.effects.cannotTriggerAbilities()),
        immuneTo: (source: ImmunitySource) => card(AbilityDsl.effects.immunity({ restricts: source })),
        loseAllNonKeywordAbilities: () => card(AbilityDsl.effects.loseAllNonKeywordAbilities()),
        /** "As an additional cost to declare this character as an attacker or defender, you lose X honor." */
        honorCostToDeclare: (amount: number) => card(AbilityDsl.effects.honorCostToDeclare({ amount })),
        entersPlayDishonored: () => card(AbilityDsl.effects.entersPlayWithStatus(CharacterStatus.Dishonored)),
        /** "While this character is attacking, the contested ring gains the element." */
        addElementAsAttacker: (element: (source: BaseCard) => string | string[]) =>
            card(
                AbilityDsl.effects.addElementAsAttacker((_target: BaseCard, context) =>
                    element(context.source as BaseCard)
                )
            ),
        /** The affected card gains the ability. Its source is the card that gains it. */
        gainAbility: (build: ($ability: AbilityEntry<DrawCard, 'gained'>) => GainedAbility<DrawCard>) => {
            const { type, props } = gained.compile(build(gained.entry) as GainedAbility<BaseCard>);
            return card(AbilityDsl.effects.gainAbility(type as AbilityType.Action, props as never));
        },

        // ---- Conflict modifiers ----
        /** Resolve this many more elements of the contested ring. */
        conflictElementsToResolve: (amount: number) => conflict(AbilityDsl.effects.modifyConflictElementsToResolve(amount)),

        // ---- Player modifiers ----
        /** Cards that match cost less to play from a province. */
        reduceCostWhenPlayedFromProvince: (amount: number, match: (card: DrawCard, source: BaseCard) => boolean) =>
            player(AbilityDsl.effects.reduceCost({ amount, match, playingTypes: PlayType.PlayFromProvince }))
    };
}

export type ModifierKit = ReturnType<typeof createModifierKit>;
