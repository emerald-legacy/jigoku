import { type AbilityTypes, EffectNames } from '../../Constants';
import type {
    ActionProps,
    PersistentEffectProps,
    TriggeredAbilityProps,
    TriggeredAbilityWhenProps
} from '../../Interfaces';
import type CardEffect from '../CardEffect';
import { EffectBuilder } from '../EffectBuilder';
import GainAbility from '../GainAbility';

type Res = (game: any, source: any, props: any) => CardEffect;

export function gainAbility(abilityType: AbilityTypes.Action, properties: ActionProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility(abilityType: AbilityTypes.DuelReaction, properties: TriggeredAbilityWhenProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility(abilityType: AbilityTypes.Persistent, properties: PersistentEffectProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility(abilityType: AbilityTypes.Reaction, properties: TriggeredAbilityProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility(abilityType: AbilityTypes.WouldInterrupt, properties: TriggeredAbilityProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility(abilityType: AbilityTypes.Interrupt, properties: TriggeredAbilityProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility(abilityType: AbilityTypes.ForcedReaction, properties: TriggeredAbilityProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overloads are not true redeclarations
export function gainAbility(abilityType: AbilityTypes.ForcedInterrupt, properties: TriggeredAbilityProps): Res;
// eslint-disable-next-line no-redeclare -- TypeScript function overload implementation
export function gainAbility(
    abilityType: AbilityTypes,
    properties: ActionProps | TriggeredAbilityWhenProps | TriggeredAbilityProps | PersistentEffectProps
) {
    return EffectBuilder.card.static(EffectNames.GainAbility, new GainAbility(abilityType, properties));
}
