import type { CardType, ConflictType, Element, EventName, Players, PlayType } from '../Constants.js';
import { EffectName } from '../Constants.js';
import type Player from '../Player.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type Ring from '../Ring.js';
import type { GameObject } from '../GameObject.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import type { Cost } from '../costs/Cost.js';
import type { Conflict } from '../Conflict.js';
import type { Faction } from '../BaseCard.js';
import type CardAbility from '../CardAbility.js';
import type { Duel } from '../Duel.js';
import type { ElementSymbolInfo } from '../ElementSymbol.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type { MsgArg } from '../GameChat.js';
import type { EffectBase } from './EffectBase.js';
import type { CardEffect } from './types.js';
import type { GainedAbilityValue } from './GainAbility.js';
import type { DynamicMatch } from './GainAllAbilitiesDynamic.js';

// Structural view of Restriction (consumers only call `.isMatch`); `card?: GameObject` so the
// base GameObject.checkRestrictions can pass `this` without a downcast (isMatch's method params
// are bivariant, so a real Restriction still satisfies this).
type RestrictionLike = { isMatch(type: string, context: AbilityContext | undefined, card?: GameObject): boolean };

export type FatePool = DrawCard | Ring;

export interface ParticipantCostEffect {
    type: string;
    cost: GameAction | ((player: Player) => GameAction);
    message?: string;
}

export type DashSkillType = 'military' | 'political';

// Method syntax on purpose: cards narrow the context and event types.
interface DelayedEffectCallbacks<N extends EventName> {
    condition(context: AbilityContext): unknown;
    trigger(event: GameEvent<N>, context: AbilityContext): unknown;
    messageArgs(context: AbilityContext, targets: GameObject[]): MsgArg[];
}

export type DelayedEffectWhen = { [N in EventName]?: DelayedEffectCallbacks<N>['trigger'] };

export type DelayedEffectValue = {
    condition?: DelayedEffectCallbacks<EventName>['condition'];
    when?: DelayedEffectWhen;
    multipleTrigger?: boolean;
    onlyRemoveOnSuccess?: boolean;
    gameAction: GameAction;
    message?: string;
    messageArgs?: MsgArg[] | DelayedEffectCallbacks<EventName>['messageArgs'];
};

// Method syntax on purpose: cards narrow the card type.
interface UnlessActionCostCallback {
    cost(card: BaseCard): GameAction;
}

export interface UnlessActionCostValue {
    actionName: string;
    cost: GameAction | UnlessActionCostCallback['cost'];
}

export interface CanPlayFromOutOfPlayValue {
    player: (player: Player, card: BaseCard) => boolean;
    playType?: PlayType;
}

export type AbilityLimitIncrease = { applyingPlayer?: Player; targetAbility?: CardAbility };

/**
 * The value `getEffects(name)` yields for each effect name: what a static effect holds, what a
 * dynamic effect calculates, or `boolean` for detached effects, which hold no value.
 * `EffectBuilder` checks every value against this map. Effects created without a value hold `true`.
 */
export interface EffectValueMap {
    [EffectName.AbilityRestrictions]: RestrictionLike;
    [EffectName.AddElementAsAttacker]: Element | Element[];
    [EffectName.AddFlag]: string;
    [EffectName.AddFaction]: string;
    [EffectName.LoseFaction]: string;
    [EffectName.AddKeyword]: string;
    [EffectName.AddTrait]: string;
    [EffectName.LoseTrait]: string;
    [EffectName.AttachmentCardCondition]: (card: DrawCard) => boolean;
    [EffectName.AttachmentFactionRestriction]: Faction[];
    [EffectName.AttachmentLimit]: number;
    [EffectName.AttachmentMyControlOnly]: boolean;
    [EffectName.AttachmentOpponentControlOnly]: boolean;
    [EffectName.AttachmentRestrictTraitAmount]: Record<string, number>;
    [EffectName.AttachmentTraitRestriction]: string[];
    [EffectName.AttachmentUniqueRestriction]: boolean;
    [EffectName.Blank]: boolean;
    [EffectName.CalculatePrintedMilitarySkill]: (card: DrawCard) => number;
    [EffectName.CanBeSeenWhenFacedown]: boolean;
    [EffectName.CanBeTriggeredByOpponent]: boolean;
    [EffectName.CanOnlyBeDeclaredAsAttackerWithElement]: Element;
    [EffectName.CanOnlyBeDeclaredAsAttackerWithCondition]: (props: ICanOnlyBeDeclaredAsAttackerWithCondition) => boolean;
    [EffectName.CannotApplyLastingEffects]: (effect: EffectBase<EffectName, GameObject, unknown>) => boolean;
    [EffectName.CannotBeAttacked]: boolean;
    [EffectName.CannotHaveConflictsDeclaredOfType]: string;
    [EffectName.CannotHaveOtherRestrictedAttachments]: BaseCard;
    [EffectName.CannotParticipateAsAttacker]: string;
    [EffectName.CannotParticipateAsDefender]: string;
    [EffectName.CardCostToAttackMilitary]: number;
    [EffectName.ChangeContributionFunction]: (card: DrawCard) => number;
    [EffectName.ChangeType]: CardType;
    [EffectName.CopyCharacter]: DrawCard;
    [EffectName.CopyProvince]: ProvinceCard;
    [EffectName.CustomEffect]: boolean;
    [EffectName.CustomProvinceRefillEffect]: (player: Player, province: ProvinceCard) => void;
    [EffectName.DelayedEffect]: DelayedEffectValue;
    [EffectName.DoesNotBow]: boolean;
    [EffectName.DoesNotReady]: boolean;
    [EffectName.EntersPlayWithStatus]: 'honored' | 'ordinary' | 'dishonored';
    [EffectName.EntersPlayForOpponent]: boolean;
    [EffectName.FateCostToAttack]: number;
    [EffectName.HonorCostToDeclare]: { amount: number, dueToStatusToken?: boolean };
    [EffectName.FateCostToRingToDeclareConflictAgainst]: number;
    [EffectName.FateCostToTarget]: { cardType?: string; targetPlayer?: Players; amount: number };
    [EffectName.PlayerFateCostToTargetCard]: { match: (card: BaseCard) => boolean; amount: number };
    [EffectName.GainAbility]: GainedAbilityValue;
    [EffectName.GainAllAbilities]: BaseCard;
    [EffectName.GainAllAbilitiesDynamic]: DynamicMatch;
    [EffectName.GainExtraFateWhenPlayed]: number;
    [EffectName.GainPlayAction]: boolean;
    [EffectName.HideWhenFaceUp]: boolean;
    [EffectName.HonorStatusDoesNotAffectLeavePlay]: boolean;
    [EffectName.HonorStatusDoesNotModifySkill]: boolean;
    [EffectName.TaintedStatusDoesNotCostHonor]: boolean;
    [EffectName.HonorStatusReverseModifySkill]: boolean;
    [EffectName.IncreaseLimitOnAbilities]: AbilityLimitIncrease | true;
    [EffectName.IncreaseLimitOnPrintedAbilities]: CardAbility | true;
    [EffectName.LegendaryFate]: number;
    [EffectName.LoseKeyword]: string;
    [EffectName.ModifyBaseMilitarySkillMultiplier]: number;
    [EffectName.ModifyBasePoliticalSkillMultiplier]: number;
    [EffectName.ModifyBaseProvinceStrength]: number;
    [EffectName.ModifyBothSkills]: number;
    [EffectName.ModifyDuelistSkill]: number | { value: number; duel: Duel };
    [EffectName.ModifyGlory]: number;
    [EffectName.ModifyMilitarySkill]: number;
    [EffectName.SwitchAttachmentSkillModifiers]: boolean;
    [EffectName.AttachmentMilitarySkillModifier]: number;
    [EffectName.ModifyMilitarySkillMultiplier]: number;
    [EffectName.ModifyPoliticalSkill]: number;
    [EffectName.AttachmentPoliticalSkillModifier]: number;
    [EffectName.ModifyPoliticalSkillMultiplier]: number;
    [EffectName.ModifyProvinceStrengthBonus]: number;
    [EffectName.ModifyProvinceStrength]: number;
    [EffectName.ModifyProvinceStrengthMultiplier]: number;
    [EffectName.ModifyRestrictedAttachmentAmount]: number;
    [EffectName.MustBeChosen]: RestrictionLike;
    [EffectName.MustBeDeclaredAsAttacker]: string;
    [EffectName.MustBeDeclaredAsAttackerIfType]: string;
    [EffectName.MustBeDeclaredAsDefender]: string;
    [EffectName.SetApparentFate]: number;
    [EffectName.SetBaseDash]: DashSkillType;
    [EffectName.SetBaseMilitarySkill]: number;
    [EffectName.SetBasePoliticalSkill]: number;
    [EffectName.SetBaseProvinceStrength]: number;
    [EffectName.SatisfyAffinity]: string | string[];
    [EffectName.SetConflictDeclarationType]: ConflictType;
    [EffectName.ProvideConflictDeclarationType]: ConflictType;
    [EffectName.ForceConflictDeclarationType]: ConflictType;
    [EffectName.SetConflictTotalSkill]: number;
    [EffectName.SetDash]: DashSkillType;
    [EffectName.SetGlory]: number;
    [EffectName.SetMilitarySkill]: number;
    [EffectName.SetPoliticalSkill]: number;
    [EffectName.SetProvinceStrengthBonus]: number;
    [EffectName.SetProvinceStrength]: number;
    [EffectName.SwitchBaseSkills]: boolean;
    [EffectName.SuppressEffects]: CardEffect[];
    [EffectName.TakeControl]: Player | undefined;
    [EffectName.TerminalCondition]: unknown;
    [EffectName.UnlessActionCost]: UnlessActionCostValue;
    [EffectName.AddElement]: Element | Element[];
    [EffectName.CannotBidInDuels]: number | string;
    [EffectName.CannotContribute]: (card: DrawCard) => boolean;
    [EffectName.CannotDeclareRing]: (player: Player) => boolean;
    [EffectName.ConsiderRingAsClaimed]: (player: Player) => boolean;
    [EffectName.AdditionalAction]: number;
    [EffectName.AdditionalActionAfterWindowCompleted]: number;
    [EffectName.AdditionalCardPlayed]: number;
    [EffectName.AdditionalCharactersInConflict]: number;
    [EffectName.AdditionalConflict]: string | true;
    [EffectName.AdditionalTriggerCost]: (context: AbilityContext) => Cost | Cost[];
    [EffectName.AdditionalPlayCost]: (context: AbilityContext) => Cost | Cost[];
    [EffectName.AlternateFatePool]: (card: DrawCard) => FatePool | false;
    [EffectName.CannotDeclareConflictsOfType]: string;
    [EffectName.CanPlayFromOwn]: boolean;
    [EffectName.CanPlayFromOutOfPlay]: CanPlayFromOutOfPlayValue;
    [EffectName.CanPlayFromOpponents]: boolean;
    [EffectName.CannotResolveRings]: boolean;
    [EffectName.ChangePlayerGloryModifier]: number;
    [EffectName.ChangePlayerSkillModifier]: number;
    [EffectName.GainActionPhasePriority]: boolean;
    [EffectName.CostReducer]: boolean;
    [EffectName.ModifyCardsDrawnInDrawPhase]: number;
    [EffectName.SetMaxConflicts]: number;
    [EffectName.ShowTopConflictCard]: Players;
    [EffectName.ShowTopDynastyCard]: boolean;
    [EffectName.ContributeToConflict]: Player;
    [EffectName.CanContributeWhileBowed]: true;
    [EffectName.CanContributeGloryWhileBowed]: true;
    [EffectName.ChangeConflictSkillFunction]: (card: DrawCard, conflict: Conflict) => number;
    [EffectName.ModifyConflictElementsToResolve]: number;
    [EffectName.RestrictNumberOfDefenders]: number;
    [EffectName.ResolveConflictEarly]: boolean;
    [EffectName.SetBaseGlory]: number;
    [EffectName.EventsCannotBeCancelled]: boolean;
    [EffectName.ForceConflictUnopposed]: boolean;
    [EffectName.MustDeclareMaximumAttackers]: string;
    [EffectName.RefillProvinceTo]: number;
    [EffectName.RestartDynastyPhase]: BaseCard;
    [EffectName.StrongholdCanBeAttacked]: boolean;
    [EffectName.DefendersChosenFirstDuringConflict]: number;
    [EffectName.LimitHonorGainPerPhase]: number;
    [EffectName.RegisterToPlayFromOutOfPlay]: unknown;
    [EffectName.CostToDeclareAnyParticipants]: ParticipantCostEffect;
    [EffectName.LoseAllNonKeywordAbilities]: boolean;
    [EffectName.ParticipatesFromHome]: true;
    [EffectName.AdditionalAttackedProvince]: ProvinceCard;
    [EffectName.ReplacePrintedElement]: Pick<ElementSymbolInfo, 'key' | 'element'>;
    [EffectName.ProvinceCannotHaveSkillIncreased]: true;
    [EffectName.ConsideredLessHonorable]: boolean;
    [EffectName.CustomFatePhaseFateRemoval]: (player: Player, numFate: number) => void;
    [EffectName.WinDuel]: Duel;
    [EffectName.WinDuelTies]: boolean;
    [EffectName.IgnoreDuelSkill]: boolean;
    [EffectName.PayPrintedCostToOpponent]: boolean;
    [EffectName.ConflictIgnoreStatusTokens]: boolean;
    [EffectName.LimitLegalAttackers]: (card: DrawCard) => boolean;
    [EffectName.ModifyHonorTransferGiven]: number;
    [EffectName.ModifyHonorTransferReceived]: number;
    [EffectName.ModifyUnopposedHonorLoss]: number;
    [EffectName.TriggersAbilitiesFromHome]: object;
    [EffectName.ModifyDuelSkill]: { player?: Player; amount: number };
    [EffectName.ApplyStatusTokensToDuel]: boolean;
    [EffectName.DuelIgnorePrintedSkill]: boolean;
}

export type NumericEffectName = {
    [K in EffectName]: EffectValueMap[K] extends number ? K : never
}[EffectName];

/** Names whose values are never functions, so a function passed for them is a per-target calculation. */
export type FlexibleEffectName = {
    [K in EffectName]: EffectValueMap[K] extends (...args: never[]) => unknown ? never : K
}[EffectName];

export interface ICanOnlyBeDeclaredAsAttackerWithCondition {
    context: AbilityContext,
    conflictType: string,
    ring: Ring,
    province?: ProvinceCard | null,
    incomingAttackers?: DrawCard[]
}
