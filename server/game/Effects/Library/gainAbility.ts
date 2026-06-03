import { type AbilityType, EffectName } from '../../Constants.js';
import type {
    ActionProps,
    PersistentEffectProps,
    TriggeredAbilityProps,
    TriggeredAbilityWhenProps
} from '../../Interfaces.js';
import { EffectBuilder } from '../EffectBuilder.js';
import GainAbility from '../GainAbility.js';

type Res = ReturnType<typeof EffectBuilder.card.static>;

export function gainAbility(abilityType: AbilityType.Action, properties: ActionProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility(abilityType: AbilityType.DuelReaction, properties: TriggeredAbilityWhenProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility(abilityType: AbilityType.Persistent, properties: PersistentEffectProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility(abilityType: AbilityType.Reaction, properties: TriggeredAbilityProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility(abilityType: AbilityType.WouldInterrupt, properties: TriggeredAbilityProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility(abilityType: AbilityType.Interrupt, properties: TriggeredAbilityProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility(abilityType: AbilityType.ForcedReaction, properties: TriggeredAbilityProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility(abilityType: AbilityType.ForcedInterrupt, properties: TriggeredAbilityProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overload implementation
export function gainAbility(
    abilityType: AbilityType,
    properties: ActionProps | TriggeredAbilityWhenProps | TriggeredAbilityProps | PersistentEffectProps
) {
    return EffectBuilder.card.static(EffectName.GainAbility, new GainAbility(abilityType, properties));
}
