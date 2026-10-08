import { type AbilityType, EffectName, type Location } from '../../Constants.js';
import type {
    ActionProps,
    PersistentEffectProps,
    TargetLocation,
    TriggeredAbilityProps,
    TriggeredAbilityWhenProps
} from '../../Interfaces.js';
import type BaseCard from '../../BaseCard.js';
import type { CardAbility } from '../../CardAbility.js';
import type DrawCard from '../../DrawCard.js';
import { EffectBuilder, type EffectTarget } from '../EffectBuilder.js';
import { GainAbility, type GainAbilityArgs } from '../GainAbility.js';

type Res = ReturnType<typeof EffectBuilder.card.static>;

export function gainAbility(abilityType: AbilityType, ability: CardAbility): Res;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.Action, properties: ActionProps<Source>): Res;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.DuelReaction, properties: TriggeredAbilityWhenProps<Source>): Res;

export function gainAbility<Source extends BaseCard = DrawCard, T extends EffectTarget = EffectTarget, L extends TargetLocation = Location.PlayArea>(abilityType: AbilityType.Persistent, properties: PersistentEffectProps<Source, T, L>): Res;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.Reaction, properties: TriggeredAbilityProps<Source>): Res;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.WouldInterrupt, properties: TriggeredAbilityProps<Source>): Res;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.Interrupt, properties: TriggeredAbilityProps<Source>): Res;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.ForcedReaction, properties: TriggeredAbilityProps<Source>): Res;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.ForcedInterrupt, properties: TriggeredAbilityProps<Source>): Res;

export function gainAbility(...args: GainAbilityArgs) {
    return EffectBuilder.card.static(EffectName.GainAbility, new GainAbility(...args));
}
