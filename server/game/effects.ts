import * as AbilityLimit from './AbilityLimit.js';
import { GainAllAbilitiesDynamic } from './Effects/GainAllAbilitiesDynamic.js';
import { Restriction } from './Effects/Restriction.js';
import { SuppressEffect } from './Effects/SuppressEffect.js';
import { EffectBuilder } from './Effects/EffectBuilder.js';
import { attachmentMilitarySkillModifier } from './Effects/Library/attachmentMilitarySkillModifier.js';
import { attachmentPoliticalSkillModifier } from './Effects/Library/attachmentPoliticalSkillModifier.js';
import { canPlayFromOwn } from './Effects/Library/canPlayFromOwn.js';
import { cardCannot } from './Effects/Library/cardCannot.js';
import { changePlayerGloryModifier } from './Effects/Library/changePlayerGloryModifier.js';
import { copyCard, copyProvince } from './Effects/Library/copyCard.js';
import { delayedEffect, playerDelayedEffect } from './Effects/Library/delayedEffect.js';
import { gainAllAbilities } from './Effects/Library/gainAllAbilities.js';
import { gainAbility } from './Effects/Library/gainAbility.js';
import { hideWhenFaceUp } from './Effects/Library/hideWhenFaceUp.js';
import { mustBeDeclaredAsAttacker } from './Effects/Library/mustBeDeclaredAsAttacker.js';
import { reduceCost } from './Effects/Library/reduceCost.js';
import { switchAttachmentSkillModifiers } from './Effects/Library/switchAttachmentSkillModifiers.js';
import { takeControl } from './Effects/Library/takeControl.js';
import { EffectName, PlayType, CardType, Players, RestrictionType, RestrictionScope } from './Constants.js';
import type { Location } from './Constants.js';
import type { traitLimit } from './Interfaces.js';
import type DrawCard from './DrawCard.js';
import type BaseCard from './BaseCard.js';
import type Player from './Player.js';
import type Ring from './Ring.js';
import type { BaseAction } from './BaseAction.js';
import type { AbilityContext } from './AbilityContext.js';
import type { EffectFactory, FlexibleValue } from './Effects/EffectBuilder.js';
import type { DetachedValue } from './Effects/DetachedEffect.js';
import type { DynamicMatch } from './Effects/GainAllAbilitiesDynamic.js';
import type { CostReducerProps } from './CostReducer.js';
import type { RestrictionProperties } from './Effects/Restriction.js';
import type { EffectApplier } from './Effects/EffectApplier.js';
import type { Conflict } from './Conflict.js';
import type { Faction } from './BaseCard.js';
import type { Duel } from './Duel.js';
import type { CharacterStatus, ConflictType, Element, SkillType, Trait } from './Constants.js';
import type { StatusToken } from './StatusToken.js';
import type {
    AbilityLimitIncrease,
    EffectValueMap,
    ICanOnlyBeDeclaredAsAttackerWithCondition,
    ParticipantCostEffect,
    UnlessActionCostValue
} from './Effects/EffectValueMap.js';

type ConflictTypeOrBoth = ConflictType | 'both';

/* Types of effect
    1. Static effects - do something for a period
    2. Dynamic effects - like static, but what they do depends on the game state
    3. Detached effects - do something when applied, and on expiration, but can be ignored in the interim
*/

function modifyDuelistSkill(value: number, duel: Duel | undefined): EffectFactory<BaseCard>;
function modifyDuelistSkill(value: FlexibleValue<number>): EffectFactory<BaseCard>;
function modifyDuelistSkill(value: FlexibleValue<number>, duel?: Duel): EffectFactory<BaseCard> {
    return duel !== undefined && typeof value === 'number'
        ? EffectBuilder.card.static(EffectName.ModifyDuelistSkill, { value, duel })
        : EffectBuilder.card.flexible(EffectName.ModifyDuelistSkill, value);
}

// Card effects
export const addElementAsAttacker = (element: FlexibleValue<Element | Element[]>) => EffectBuilder.card.flexible(EffectName.AddElementAsAttacker, element);
export const addFlag = (flag: string) => EffectBuilder.card.static(EffectName.AddFlag, flag);
export const addFaction = (faction: Faction) => EffectBuilder.card.static(EffectName.AddFaction, faction);
export const loseFaction = (faction: string) => EffectBuilder.card.static(EffectName.LoseFaction, faction);
export const addKeyword = (keyword: string) => EffectBuilder.card.static(EffectName.AddKeyword, keyword);
export const addTrait = (trait: Trait) => EffectBuilder.card.static(EffectName.AddTrait, trait);
export const additionalTriggerCostForCard = (func: EffectValueMap[EffectName.AdditionalTriggerCost]) => EffectBuilder.card.static(EffectName.AdditionalTriggerCost, func);
export const attachmentCardCondition = (func: (card: DrawCard) => boolean) => EffectBuilder.card.static(EffectName.AttachmentCardCondition, func);
export const attachmentFactionRestriction = (factions: Faction[]) =>
    EffectBuilder.card.static(EffectName.AttachmentFactionRestriction, factions);
export const attachmentLimit = (amount: number) => EffectBuilder.card.static(EffectName.AttachmentLimit, amount);
export const attachmentMyControlOnly = () => EffectBuilder.card.static(EffectName.AttachmentMyControlOnly, true);
export const attachmentOpponentControlOnly = () => EffectBuilder.card.static(EffectName.AttachmentOpponentControlOnly, true);
export const attachmentRestrictTraitAmount = (object: traitLimit) =>
    EffectBuilder.card.static(EffectName.AttachmentRestrictTraitAmount, object);
export const attachmentTraitRestriction = (traits: Trait[]) => EffectBuilder.card.static(EffectName.AttachmentTraitRestriction, traits);
export const attachmentUniqueRestriction = () => EffectBuilder.card.static(EffectName.AttachmentUniqueRestriction, true);
export const blank = (blankTraits: boolean = false) => EffectBuilder.card.static(EffectName.Blank, blankTraits);
export const calculatePrintedMilitarySkill = (func: EffectValueMap[EffectName.CalculatePrintedMilitarySkill]) => EffectBuilder.card.static(EffectName.CalculatePrintedMilitarySkill, func);
export const canPlayFromOutOfPlay = (player: (player: Player, card: BaseCard) => boolean, playType: PlayType = PlayType.PlayFromHand) =>
    EffectBuilder.card.static(EffectName.CanPlayFromOutOfPlay, { player: player, playType: playType });
export const registerToPlayFromOutOfPlay = () =>
    EffectBuilder.card.detached(EffectName.RegisterToPlayFromOutOfPlay, {
        apply: (card) => {
            for(const reaction of card.getReactions()) {
                reaction.registerEvents();
            }
        },
        unapply: () => true
    });
export const canBeSeenWhenFacedown = () => EffectBuilder.card.static(EffectName.CanBeSeenWhenFacedown, true);
export const canBeTriggeredByOpponent = () => EffectBuilder.card.static(EffectName.CanBeTriggeredByOpponent, true);
export const canOnlyBeDeclaredAsAttackerWithElement = (element: FlexibleValue<Element>) =>
    EffectBuilder.card.flexible(EffectName.CanOnlyBeDeclaredAsAttackerWithElement, element);
export const canOnlyBeDeclaredAsAttackerWithCondition = (condition: (props: ICanOnlyBeDeclaredAsAttackerWithCondition) => boolean) =>
    EffectBuilder.card.static(EffectName.CanOnlyBeDeclaredAsAttackerWithCondition, condition);
export const cannotApplyLastingEffects = (condition: EffectValueMap[EffectName.CannotApplyLastingEffects]) =>
    EffectBuilder.card.static(EffectName.CannotApplyLastingEffects, condition);
export const cannotBeAttacked = () => EffectBuilder.card.static(EffectName.CannotBeAttacked, true);
export const cannotBeDeclaredAsAttacker = () => cardCannot(RestrictionType.DeclareAsAttacker);
export const cannotBeDeclaredAsDefender = () => cardCannot(RestrictionType.DeclareAsDefender);
export const cannotHaveConflictsDeclaredOfType = (type: FlexibleValue<ConflictType>) =>
    EffectBuilder.card.flexible(EffectName.CannotHaveConflictsDeclaredOfType, type);
export const cannotHaveOtherRestrictedAttachments = (card: BaseCard) =>
    EffectBuilder.card.static(EffectName.CannotHaveOtherRestrictedAttachments, card);
export const cannotParticipateAsAttacker = (type: ConflictTypeOrBoth = 'both') =>
    EffectBuilder.card.static(EffectName.CannotParticipateAsAttacker, type);
export const cannotParticipateAsDefender = (type: ConflictTypeOrBoth = 'both') =>
    EffectBuilder.card.static(EffectName.CannotParticipateAsDefender, type);
export const cannotReceiveDishonorToken = () => cardCannot(RestrictionType.ReceiveDishonorToken);
export const cannotReceiveHonorToken = () => cardCannot(RestrictionType.ReceiveHonorToken);
export const cannotReceiveTaintedToken = () => cardCannot(RestrictionType.ReceiveTaintedToken);
export const cannotTriggerAbilities = () => cardCannot(RestrictionType.TriggerAbilities);
export const changeContributionFunction = (func: (card: DrawCard) => number) => EffectBuilder.card.static(EffectName.ChangeContributionFunction, func);
export const changeType = (type: CardType) => EffectBuilder.card.static(EffectName.ChangeType, type);
export const contributeToConflict = (player: FlexibleValue<Player>) => EffectBuilder.card.flexible(EffectName.ContributeToConflict, player);
export const canContributeWhileBowed = () => EffectBuilder.card.static(EffectName.CanContributeWhileBowed, true);
export const canContributeGloryWhileBowed = () => EffectBuilder.card.static(EffectName.CanContributeGloryWhileBowed, true);
export const customDetachedCard = <S>(properties: DetachedValue<BaseCard, S>) => EffectBuilder.card.detached(EffectName.CustomEffect, properties);
export const customRefillProvince = (refillFunc: EffectValueMap[EffectName.CustomProvinceRefillEffect]) => EffectBuilder.card.static(EffectName.CustomProvinceRefillEffect, refillFunc);
export const doesNotBow = () => EffectBuilder.card.static(EffectName.DoesNotBow, true);
export const doesNotReady = () => EffectBuilder.card.static(EffectName.DoesNotReady, true);
export const entersPlayWithStatus = (status: EffectValueMap[EffectName.EntersPlayWithStatus]) => EffectBuilder.card.static(EffectName.EntersPlayWithStatus, status);
export const entersPlayForOpponent = () => EffectBuilder.card.static(EffectName.EntersPlayForOpponent, true);
export const fateCostToAttack = (amount: FlexibleValue<number> = 1) => EffectBuilder.card.flexible(EffectName.FateCostToAttack, amount);
export const cardCostToAttackMilitary = (amount: FlexibleValue<number> = 1) => EffectBuilder.card.flexible(EffectName.CardCostToAttackMilitary, amount);
export const honorCostToDeclare = (properties: EffectValueMap[EffectName.HonorCostToDeclare] = { amount: 1, dueToStatusToken: false }) => EffectBuilder.card.static(EffectName.HonorCostToDeclare, properties);
export const fateCostToRingToDeclareConflictAgainst = (amount: FlexibleValue<number> = 1) =>
    EffectBuilder.card.flexible(EffectName.FateCostToRingToDeclareConflictAgainst, amount);
export const fateCostToTarget = (properties: FlexibleValue<EffectValueMap[EffectName.FateCostToTarget]>) => EffectBuilder.card.flexible(EffectName.FateCostToTarget, properties);
export const gainAllAbilitiesDynamic = (match: DynamicMatch, printedAbilitiesOnly = false) =>
    EffectBuilder.card.static(EffectName.GainAllAbilitiesDynamic, new GainAllAbilitiesDynamic(match, printedAbilitiesOnly));
export const gainExtraFateWhenPlayed = (amount: FlexibleValue<number> = 1) => EffectBuilder.card.flexible(EffectName.GainExtraFateWhenPlayed, amount);
export const gainPlayAction = (playActionClass: new (card: DrawCard) => BaseAction) =>
    EffectBuilder.card.detached(EffectName.GainPlayAction, {
        apply: (card: DrawCard) => {
            const action = new playActionClass(card);
            card.abilities.playActions.push(action);
            return action;
        },
        unapply: (card, _context, playAction) =>
            (card.abilities.playActions = card.abilities.playActions.filter((action) => action !== playAction))
    });
export const honorStatusDoesNotAffectLeavePlay = () => EffectBuilder.card.static(EffectName.HonorStatusDoesNotAffectLeavePlay, true);
export const honorStatusDoesNotModifySkill = () => EffectBuilder.card.static(EffectName.HonorStatusDoesNotModifySkill, true);
export const statusTokensDoNotDecreaseSkill = () => EffectBuilder.card.static(EffectName.StatusTokensDoNotDecreaseSkill, true);
export const taintedStatusDoesNotCostHonor = () => EffectBuilder.card.static(EffectName.TaintedStatusDoesNotCostHonor, true);
export const honorStatusReverseModifySkill = () => EffectBuilder.card.static(EffectName.HonorStatusReverseModifySkill, true);
export const immunity = (properties: RestrictionType | PlayType | RestrictionProperties) => EffectBuilder.card.static(EffectName.AbilityRestrictions, new Restriction(properties));
export const increaseLimitOnAbilities = (abilities?: AbilityLimitIncrease) => EffectBuilder.card.static(EffectName.IncreaseLimitOnAbilities, abilities ?? true);
export const increaseLimitOnPrintedAbilities = (abilities?: EffectValueMap[EffectName.IncreaseLimitOnPrintedAbilities]) =>
    EffectBuilder.card.static(EffectName.IncreaseLimitOnPrintedAbilities, abilities ?? true);
export const legendaryFate = (amount: FlexibleValue<number> = 1) => EffectBuilder.card.flexible(EffectName.LegendaryFate, amount);
export const loseAllNonKeywordAbilities = () => EffectBuilder.card.static(EffectName.LoseAllNonKeywordAbilities, true);
/** Gained actions, reactions, constant abilities and keywords stop working; printed ones are kept. */
export const loseGainedAbilities = () => EffectBuilder.card.static(EffectName.LoseGainedAbilities, true);
export const loseKeyword = (keyword: string) => EffectBuilder.card.static(EffectName.LoseKeyword, keyword);
export const loseTrait = (trait: string) => EffectBuilder.card.static(EffectName.LoseTrait, trait);
export const modifyBaseMilitarySkillMultiplier = (value: FlexibleValue<number>) =>
    EffectBuilder.card.flexible(EffectName.ModifyBaseMilitarySkillMultiplier, value);
export const modifyBasePoliticalSkillMultiplier = (value: FlexibleValue<number>) =>
    EffectBuilder.card.flexible(EffectName.ModifyBasePoliticalSkillMultiplier, value);
export const modifyBaseProvinceStrength = (value: FlexibleValue<number>) => EffectBuilder.card.flexible(EffectName.ModifyBaseProvinceStrength, value);
export const modifyBothSkills = (value: FlexibleValue<number>) => EffectBuilder.card.flexible(EffectName.ModifyBothSkills, value);
export const modifyGlory = (value: FlexibleValue<number>) => EffectBuilder.card.flexible(EffectName.ModifyGlory, value);
export const modifyMilitarySkill = (value: FlexibleValue<number>) => EffectBuilder.card.flexible(EffectName.ModifyMilitarySkill, value);
export const modifyMilitarySkillMultiplier = (value: FlexibleValue<number>) =>
    EffectBuilder.card.flexible(EffectName.ModifyMilitarySkillMultiplier, value);
export const modifyPoliticalSkill = (value: FlexibleValue<number>) => EffectBuilder.card.flexible(EffectName.ModifyPoliticalSkill, value);
export const modifyPoliticalSkillMultiplier = (value: FlexibleValue<number>) =>
    EffectBuilder.card.flexible(EffectName.ModifyPoliticalSkillMultiplier, value);
export const modifyProvinceStrength = (value: FlexibleValue<number>) => EffectBuilder.card.flexible(EffectName.ModifyProvinceStrength, value);
export const modifyProvinceStrengthMultiplier = (value: FlexibleValue<number>) =>
    EffectBuilder.card.flexible(EffectName.ModifyProvinceStrengthMultiplier, value);
export const modifyProvinceStrengthBonus = (value: FlexibleValue<number>) => EffectBuilder.card.flexible(EffectName.ModifyProvinceStrengthBonus, value);
export const modifyRestrictedAttachmentAmount = (value: FlexibleValue<number>) =>
    EffectBuilder.card.flexible(EffectName.ModifyRestrictedAttachmentAmount, value);
export const mustBeChosen = (properties: RestrictionProperties) =>
    EffectBuilder.card.static(
        EffectName.MustBeChosen,
        new Restriction(Object.assign({ cannot: RestrictionType.Target }, properties))
    );
export const mustBeDeclaredAsAttackerIfType = (type: ConflictTypeOrBoth = 'both') =>
    EffectBuilder.card.static(EffectName.MustBeDeclaredAsAttackerIfType, type);
export const mustBeDeclaredAsDefender = (type: ConflictTypeOrBoth = 'both') => EffectBuilder.card.static(EffectName.MustBeDeclaredAsDefender, type);
export const refillProvinceTo = (refillAmount: FlexibleValue<number>) => EffectBuilder.card.flexible(EffectName.RefillProvinceTo, refillAmount);
export const setApparentFate = (value: number) => EffectBuilder.card.static(EffectName.SetApparentFate, value);
export const setBaseDash = (type: SkillType) => EffectBuilder.card.static(EffectName.SetBaseDash, type);
export const setBaseMilitarySkill = (value: number) => EffectBuilder.card.static(EffectName.SetBaseMilitarySkill, value);
export const setBasePoliticalSkill = (value: number) => EffectBuilder.card.static(EffectName.SetBasePoliticalSkill, value);
export const setBaseProvinceStrength = (value: number) => EffectBuilder.card.static(EffectName.SetBaseProvinceStrength, value);
export const setDash = (type: SkillType) => EffectBuilder.card.static(EffectName.SetDash, type);
export const setGlory = (value: number) => EffectBuilder.card.static(EffectName.SetGlory, value);
export const setBaseGlory = (value: number) => EffectBuilder.card.static(EffectName.SetBaseGlory, value);
export const setMilitarySkill = (value: number) => EffectBuilder.card.static(EffectName.SetMilitarySkill, value);
export const setPoliticalSkill = (value: number) => EffectBuilder.card.static(EffectName.SetPoliticalSkill, value);
export const setProvinceStrength = (value: number) => EffectBuilder.card.static(EffectName.SetProvinceStrength, value);
export const setProvinceStrengthBonus = (value: FlexibleValue<number>) => EffectBuilder.card.flexible(EffectName.SetProvinceStrengthBonus, value);
export const provinceCannotHaveSkillIncreased = () => EffectBuilder.card.static(EffectName.ProvinceCannotHaveSkillIncreased, true);
export const switchBaseSkills = () => EffectBuilder.card.static(EffectName.SwitchBaseSkills, true);
export const suppressEffects = (condition: (effect: EffectApplier) => boolean) =>
    EffectBuilder.card.static(EffectName.SuppressEffects, new SuppressEffect(condition));
export const treatStatusTokenAs = (token: StatusToken, status: CharacterStatus) =>
    EffectBuilder.card.detached(EffectName.TreatStatusTokenAs, {
        apply: (card) => {
            token.overrideStatus = status;
            card.updateStatusTokenEffects();
        },
        unapply: (card) => {
            token.overrideStatus = undefined;
            card.updateStatusTokenEffects();
        }
    });
export const participatesFromHome = () => EffectBuilder.card.static(EffectName.ParticipatesFromHome, true);
export const unlessActionCost = (properties: UnlessActionCostValue) => EffectBuilder.card.static(EffectName.UnlessActionCost, properties);
export const replacePrintedElement = (value: EffectValueMap[EffectName.ReplacePrintedElement]) => EffectBuilder.card.static(EffectName.ReplacePrintedElement, value);
/** "When this would leave play, remove it from the game instead"; `message` is the chat line when it does. */
export const removeFromGameInsteadOfLeavingPlay = (value: EffectValueMap[EffectName.RemoveFromGameInsteadOfLeavingPlay] = {}) =>
    EffectBuilder.card.static(EffectName.RemoveFromGameInsteadOfLeavingPlay, value);
export const winDuel = (duel: Duel) => EffectBuilder.card.static(EffectName.WinDuel, duel);
export const winDuelTies = () => EffectBuilder.card.static(EffectName.WinDuelTies, true);
export const ignoreDuelSkill = () => EffectBuilder.card.static(EffectName.IgnoreDuelSkill, true);
// Ring effects
export const addElement = (element: FlexibleValue<Element | Element[], Ring>) => EffectBuilder.ring.flexible(EffectName.AddElement, element);
export const cannotBidInDuels = (num: number | string) => EffectBuilder.player.static(EffectName.CannotBidInDuels, num);
export const cannotDeclareRing = (match: (player: Player) => boolean) => EffectBuilder.ring.static(EffectName.CannotDeclareRing, match);
export const considerRingAsClaimed = (match: (player: Player) => boolean) => EffectBuilder.ring.static(EffectName.ConsiderRingAsClaimed, match);
// Player effects
export const resolveConflictEarly = () => EffectBuilder.player.static(EffectName.ResolveConflictEarly, true);
export const additionalAction = (amount: number = 1) => EffectBuilder.player.static(EffectName.AdditionalAction, amount);
export const addPlayerFlag = (flag: string) => EffectBuilder.player.static(EffectName.AddFlag, flag);
export const additionalCardPlayed = (amount: FlexibleValue<number, Player> = 1) => EffectBuilder.player.flexible(EffectName.AdditionalCardPlayed, amount);
export const additionalCharactersInConflict = (amount: FlexibleValue<number, Player>) =>
    EffectBuilder.player.flexible(EffectName.AdditionalCharactersInConflict, amount);
export const additionalConflict = (type?: ConflictType) => EffectBuilder.player.static(EffectName.AdditionalConflict, type ?? true);
export const additionalTriggerCost = (func: EffectValueMap[EffectName.AdditionalTriggerCost]) => EffectBuilder.player.static(EffectName.AdditionalTriggerCost, func);
export const additionalPlayCost = (func: EffectValueMap[EffectName.AdditionalPlayCost]) => EffectBuilder.player.static(EffectName.AdditionalPlayCost, func);
export const alternateFatePool = (match: EffectValueMap[EffectName.AlternateFatePool]) => EffectBuilder.player.static(EffectName.AlternateFatePool, match);
export const cannotDeclareConflictsOfType = (type: ConflictType) => EffectBuilder.player.static(EffectName.CannotDeclareConflictsOfType, type);
export const canPlayFromOpponents = (location: Location, cards: DrawCard[], sourceOfEffect: BaseCard, playType: PlayType = PlayType.PlayFromHand) =>
    EffectBuilder.player.detached(EffectName.CanPlayFromOpponents, {
        apply: (p) => {
            if(!p.opponent) {
                return;
            }
            for(const card of cards.filter(
                (card) => card.type === CardType.Event && card.location === location
            )) {
                for(const reaction of card.getReactions()) {
                    reaction.registerEvents();
                }
            }
            for(const card of cards) {
                if(!card.fromOutOfPlaySource) {
                    card.fromOutOfPlaySource = [];
                }
                card.fromOutOfPlaySource.push(sourceOfEffect);
            }
            return p.addPlayableLocation(playType, p.opponent, location, cards);
        },
        unapply: (player, _context, location) => {
            if(!location) {
                return;
            }
            player.removePlayableLocation(location);
            for(const card of location.cards) {
                card.removeOutOfPlaySource(sourceOfEffect);
            }
        }
    });
export const limitHonorGainPerPhase = (amount: number) => EffectBuilder.player.static(EffectName.LimitHonorGainPerPhase, amount);
export const cannotResolveRings = () => EffectBuilder.player.static(EffectName.CannotResolveRings, true);
export const changePlayerSkillModifier = (value: FlexibleValue<number, Player>) => EffectBuilder.player.flexible(EffectName.ChangePlayerSkillModifier, value);
export const customDetachedPlayer = <S>(properties: DetachedValue<Player, S>) => EffectBuilder.player.detached(EffectName.CustomEffect, properties);
export const gainActionPhasePriority = () =>
    EffectBuilder.player.detached(EffectName.GainActionPhasePriority, {
        apply: (player) => (player.actionPhasePriority = true),
        unapply: (player) => (player.actionPhasePriority = false)
    });
export const increaseCost = (properties: Omit<CostReducerProps, 'amount'> & { amount: number }) =>
    reduceCost(Object.assign({}, properties, { amount: -properties.amount }));
export const noUnopposedHonorLoss = () => EffectBuilder.player.static(EffectName.NoUnopposedHonorLoss, true);
export const modifyCardsDrawnInDrawPhase = (amount: FlexibleValue<number, Player>) =>
    EffectBuilder.player.flexible(EffectName.ModifyCardsDrawnInDrawPhase, amount);
export const playerCannot = (properties: RestrictionType | PlayType | RestrictionProperties) =>
    EffectBuilder.player.static(
        EffectName.AbilityRestrictions,
        new Restriction(
            typeof properties === 'string' ? { cannot: properties } : properties
        )
    );
export const playerFateCostToTargetCard = (properties: FlexibleValue<EffectValueMap[EffectName.PlayerFateCostToTargetCard], Player>) =>
    EffectBuilder.player.flexible(
        EffectName.PlayerFateCostToTargetCard,
        properties
    );
export const reduceNextPlayedCardCost = (amount: CostReducerProps['amount'], match?: CostReducerProps['match']) =>
    EffectBuilder.player.detached(EffectName.CostReducer, {
        apply: (player, context) =>
            player.addCostReducer(context.source, { amount: amount, match: match, limit: AbilityLimit.fixed(1) }),
        unapply: (player, _context, reducer) => player.removeCostReducer(reducer)
    });
export const satisfyAffinity = (traits: Trait | Trait[]) => EffectBuilder.player.static(EffectName.SatisfyAffinity, traits);
export const setConflictDeclarationType = (type: ConflictType) => EffectBuilder.player.static(EffectName.SetConflictDeclarationType, type);
export const provideConflictDeclarationType = (type: ConflictType) =>
    EffectBuilder.player.static(EffectName.ProvideConflictDeclarationType, type);
export const forceConflictDeclarationType = (type: ConflictType) => EffectBuilder.player.static(EffectName.ForceConflictDeclarationType, type);
export const setMaxConflicts = (amount: number) => EffectBuilder.player.static(EffectName.SetMaxConflicts, amount);
export const setConflictTotalSkill = (value: number) => EffectBuilder.player.static(EffectName.SetConflictTotalSkill, value);
export const showTopConflictCard = (players: Players = Players.Any) =>
    EffectBuilder.player.static(EffectName.ShowTopConflictCard, players);
export const showTopDynastyCard = () => EffectBuilder.player.static(EffectName.ShowTopDynastyCard, true);
export const eventsCannotBeCancelled = () => EffectBuilder.player.static(EffectName.EventsCannotBeCancelled, true);
export const mustDeclareMaximumAttackers = (type: ConflictTypeOrBoth = 'both') =>
    EffectBuilder.player.static(EffectName.MustDeclareMaximumAttackers, type);
export const restartDynastyPhase = (source: BaseCard) => EffectBuilder.player.static(EffectName.RestartDynastyPhase, source);
export const strongholdCanBeAttacked = () => EffectBuilder.player.static(EffectName.StrongholdCanBeAttacked, true);
export const defendersChosenFirstDuringConflict = (amountOfAttackers: number) =>
    EffectBuilder.player.static(EffectName.DefendersChosenFirstDuringConflict, amountOfAttackers);
export const costToDeclareAnyParticipants = (properties: ParticipantCostEffect) =>
    EffectBuilder.player.static(EffectName.CostToDeclareAnyParticipants, properties);
export const consideredLessHonorable = () => EffectBuilder.player.static(EffectName.ConsideredLessHonorable, true);
export const customFatePhaseFateRemoval = (refillFunc: EffectValueMap[EffectName.CustomFatePhaseFateRemoval]) =>
    EffectBuilder.player.static(EffectName.CustomFatePhaseFateRemoval, refillFunc);
export const changeConflictSkillFunctionPlayer = (func: EffectValueMap[EffectName.ChangeConflictSkillFunction]) =>
    EffectBuilder.player.static(EffectName.ChangeConflictSkillFunction, func);
export const limitLegalAttackers = (matchFunc: (card: DrawCard) => boolean) => EffectBuilder.player.static(EffectName.LimitLegalAttackers, matchFunc);
export const additionalActionAfterWindowCompleted = (amount: number = 1) =>
    EffectBuilder.player.static(EffectName.AdditionalActionAfterWindowCompleted, amount);
// Conflict effects
export const charactersCannot = (properties: RestrictionType | PlayType | RestrictionProperties) =>
    EffectBuilder.conflict.static(
        EffectName.AbilityRestrictions,
        new Restriction(
            typeof properties === 'string'
                ? { appliesTo: RestrictionScope.Characters, cannot: properties }
                : Object.assign({ appliesTo: RestrictionScope.Characters }, properties)
        )
    );
export const cannotContribute = (func: (conflict: Conflict, context: AbilityContext) => (card: DrawCard) => boolean) =>
    EffectBuilder.conflict.dynamic(EffectName.CannotContribute, func);
export const changeConflictSkillFunction = (func: EffectValueMap[EffectName.ChangeConflictSkillFunction]) => EffectBuilder.conflict.static(EffectName.ChangeConflictSkillFunction, func);
export const modifyConflictElementsToResolve = (value: number) =>
    EffectBuilder.conflict.static(EffectName.ModifyConflictElementsToResolve, value);
export const restrictNumberOfDefenders = (value: number) => EffectBuilder.conflict.static(EffectName.RestrictNumberOfDefenders, value);
export const forceConflictUnopposed = () => EffectBuilder.conflict.static(EffectName.ForceConflictUnopposed, true);
export const modifyUnopposedHonorLoss = (amount: number = 1) =>
    EffectBuilder.conflict.static(EffectName.ModifyUnopposedHonorLoss, amount);
export const additionalAttackedProvince = (province: EffectValueMap[EffectName.AdditionalAttackedProvince]) =>
    EffectBuilder.conflict.static(EffectName.AdditionalAttackedProvince, province);
export const conflictIgnoreStatusTokens = () => EffectBuilder.conflict.static(EffectName.ConflictIgnoreStatusTokens, true);
// Duel effects
export const modifyDuelTotal = (properties: { player?: Player; amount: number }) =>
    EffectBuilder.duel.static(EffectName.ModifyDuelTotal, { player: properties.player, amount: properties.amount });
export const applyStatusTokensToDuel = () => EffectBuilder.duel.static(EffectName.ApplyStatusTokensToDuel, true);
export const duelIgnorePrintedSkill = () => EffectBuilder.duel.static(EffectName.DuelIgnorePrintedSkill, true);

export {
    cardCannot, copyCard, copyProvince, gainAbility, gainAllAbilities, switchAttachmentSkillModifiers,
    attachmentMilitarySkillModifier, attachmentPoliticalSkillModifier, mustBeDeclaredAsAttacker, canPlayFromOwn,
    changePlayerGloryModifier, reduceCost, modifyDuelistSkill, delayedEffect, playerDelayedEffect, hideWhenFaceUp, takeControl
};
