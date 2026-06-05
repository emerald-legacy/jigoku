import { type AbilityType, EffectName } from '../../Constants.js';
import type {
    ActionProps,
    PersistentEffectProps,
    TriggeredAbilityProps,
    TriggeredAbilityWhenProps
} from '../../Interfaces.js';
import type BaseCard from '../../BaseCard.js';
import type DrawCard from '../../DrawCard.js';
import { EffectBuilder } from '../EffectBuilder.js';
import GainAbility from '../GainAbility.js';

type Res = ReturnType<typeof EffectBuilder.card.static>;

export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.Action, properties: ActionProps<Source>): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.DuelReaction, properties: TriggeredAbilityWhenProps<Source>): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.Persistent, properties: PersistentEffectProps<Source>): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.Reaction, properties: TriggeredAbilityProps<Source>): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.WouldInterrupt, properties: TriggeredAbilityProps<Source>): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.Interrupt, properties: TriggeredAbilityProps<Source>): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.ForcedReaction, properties: TriggeredAbilityProps<Source>): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility<Source extends BaseCard = DrawCard>(abilityType: AbilityType.ForcedInterrupt, properties: TriggeredAbilityProps<Source>): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overload implementation
export function gainAbility(
    abilityType: AbilityType,
    properties: ActionProps | TriggeredAbilityWhenProps | TriggeredAbilityProps | PersistentEffectProps
) {
    return EffectBuilder.card.static(EffectName.GainAbility, new GainAbility(abilityType, properties));
}
