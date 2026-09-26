import * as AbilityLimit from './AbilityLimit.js';
import GainAllAbiliitesDynamic from './Effects/GainAllAbilitiesDynamic.js';
import Restriction from './Effects/Restriction.js';
import { SuppressEffect } from './Effects/SuppressEffect.js';
import { EffectBuilder } from './Effects/EffectBuilder.js';
import { attachmentMilitarySkillModifier } from './Effects/Library/attachmentMilitarySkillModifier.js';
import { attachmentPoliticalSkillModifier } from './Effects/Library/attachmentPoliticalSkillModifier.js';
import { canPlayFromOwn } from './Effects/Library/canPlayFromOwn.js';
import { cardCannot } from './Effects/Library/cardCannot.js';
import { changePlayerGloryModifier } from './Effects/Library/changePlayerGloryModifier.js';
import { copyCard, copyProvince } from './Effects/Library/copyCard.js';
import { gainAllAbilities } from './Effects/Library/gainAllAbilities.js';
import { gainAbility } from './Effects/Library/gainAbility.js';
import { mustBeDeclaredAsAttacker } from './Effects/Library/mustBeDeclaredAsAttacker.js';
import { reduceCost } from './Effects/Library/reduceCost.js';
import { switchAttachmentSkillModifiers } from './Effects/Library/switchAttachmentSkillModifiers.js';
import { EffectName, PlayType, CardType, Players } from './Constants.js';
import type { Location } from './Constants.js';
import type DrawCard from './DrawCard.js';
import type BaseCard from './BaseCard.js';
import type Player from './Player.js';
import type Ring from './Ring.js';
import type BaseAction from './BaseAction.js';
import type { AbilityContext } from './AbilityContext.js';
import type { EffectTarget, DetachedValue, EffectFactory } from './Effects/EffectBuilder.js';
import type { DynamicMatch } from './Effects/GainAllAbilitiesDynamic.js';
import type { CostReducerProps } from './CostReducer.js';
import type { RestrictionProperties } from './Effects/Restriction.js';
import type { EffectBase } from './Effects/EffectBase.js';
import type { Conflict } from './Conflict.js';
import type { Faction } from './BaseCard.js';
import type { Duel } from './Duel.js';
import type { ConflictType, Element } from './Constants.js';
import type {
    AbilityLimitIncrease,
    DashSkillType,
    DelayedEffectValue,
    EffectValueMap,
    ICanOnlyBeDeclaredAsAttackerWithCondition,
    ParticipantCostEffect,
    UnlessActionCostValue
} from './Effects/EffectValueMap.js';

/* Types of effect
    1. Static effects - do something for a period
    2. Dynamic effects - like static, but what they do depends on the game state
    3. Detached effects - do something when applied, and on expiration, but can be ignored in the interim
*/

type Flexible<T, Target extends EffectTarget = DrawCard> = T | ((target: Target, context: AbilityContext) => T);

function modifyDuelistSkill(value: number, duel: Duel | undefined): EffectFactory;
function modifyDuelistSkill(value: Flexible<number>): EffectFactory;
function modifyDuelistSkill(value: Flexible<number>, duel?: Duel): EffectFactory {
    return duel !== undefined && typeof value === 'number'
        ? EffectBuilder.card.static(EffectName.ModifyDuelistSkill, { value, duel })
        : EffectBuilder.card.flexible(EffectName.ModifyDuelistSkill, value);
}

const Effects = {
    // Card effects
    addElementAsAttacker: (element: Flexible<Element | Element[]>) => EffectBuilder.card.flexible(EffectName.AddElementAsAttacker, element),
    addFlag: (flag: string) => EffectBuilder.card.static(EffectName.AddFlag, flag),
    addFaction: (faction: string) => EffectBuilder.card.static(EffectName.AddFaction, faction),
    loseFaction: (faction: string) => EffectBuilder.card.static(EffectName.LoseFaction, faction),
    addKeyword: (keyword: string) => EffectBuilder.card.static(EffectName.AddKeyword, keyword),
    addTrait: (trait: string) => EffectBuilder.card.static(EffectName.AddTrait, trait),
    additionalTriggerCostForCard: (func: EffectValueMap[EffectName.AdditionalTriggerCost]) => EffectBuilder.card.static(EffectName.AdditionalTriggerCost, func),
    attachmentCardCondition: (func: (card: DrawCard) => boolean) => EffectBuilder.card.static(EffectName.AttachmentCardCondition, func),
    attachmentFactionRestriction: (factions: Faction[]) =>
        EffectBuilder.card.static(EffectName.AttachmentFactionRestriction, factions),
    attachmentLimit: (amount: number) => EffectBuilder.card.static(EffectName.AttachmentLimit, amount),
    attachmentMyControlOnly: () => EffectBuilder.card.static(EffectName.AttachmentMyControlOnly, true),
    attachmentOpponentControlOnly: () => EffectBuilder.card.static(EffectName.AttachmentOpponentControlOnly, true),
    attachmentRestrictTraitAmount: (object: Record<string, number>) =>
        EffectBuilder.card.static(EffectName.AttachmentRestrictTraitAmount, object),
    attachmentTraitRestriction: (traits: string[]) => EffectBuilder.card.static(EffectName.AttachmentTraitRestriction, traits),
    attachmentUniqueRestriction: () => EffectBuilder.card.static(EffectName.AttachmentUniqueRestriction, true),
    blank: (blankTraits: boolean = false) => EffectBuilder.card.static(EffectName.Blank, blankTraits),
    calculatePrintedMilitarySkill: (func: EffectValueMap[EffectName.CalculatePrintedMilitarySkill]) => EffectBuilder.card.static(EffectName.CalculatePrintedMilitarySkill, func),
    canPlayFromOutOfPlay: (player: (player: Player, card: BaseCard) => boolean, playType: PlayType = PlayType.PlayFromHand) =>
        EffectBuilder.card.static(EffectName.CanPlayFromOutOfPlay, { player: player, playType: playType }),
    registerToPlayFromOutOfPlay: () =>
        EffectBuilder.card.detached(EffectName.CanPlayFromOutOfPlay, {
            apply: (card) => {
                for(const reaction of card.reactions) {
                    reaction.registerEvents();
                }
            },
            unapply: () => true
        }),
    canBeSeenWhenFacedown: () => EffectBuilder.card.static(EffectName.CanBeSeenWhenFacedown, true),
    canBeTriggeredByOpponent: () => EffectBuilder.card.static(EffectName.CanBeTriggeredByOpponent, true),
    canOnlyBeDeclaredAsAttackerWithElement: (element: Flexible<Element>) =>
        EffectBuilder.card.flexible(EffectName.CanOnlyBeDeclaredAsAttackerWithElement, element),
    canOnlyBeDeclaredAsAttackerWithCondition: (condition: (props: ICanOnlyBeDeclaredAsAttackerWithCondition) => boolean) =>
        EffectBuilder.card.static(EffectName.CanOnlyBeDeclaredAsAttackerWithCondition, condition),
    cannotApplyLastingEffects: (condition: (effect: EffectBase) => boolean) =>
        EffectBuilder.card.static(EffectName.CannotApplyLastingEffects, condition),
    cannotBeAttacked: () => EffectBuilder.card.static(EffectName.CannotBeAttacked, true),
    cannotBeDeclaredAsAttacker: () => cardCannot('declareAsAttacker'),
    cannotBeDeclaredAsDefender: () => cardCannot('declareAsDefender'),
    cannotHaveConflictsDeclaredOfType: (type: Flexible<string>) =>
        EffectBuilder.card.flexible(EffectName.CannotHaveConflictsDeclaredOfType, type),
    cannotHaveOtherRestrictedAttachments: (card: BaseCard) =>
        EffectBuilder.card.static(EffectName.CannotHaveOtherRestrictedAttachments, card),
    cannotParticipateAsAttacker: (type: string = 'both') =>
        EffectBuilder.card.static(EffectName.CannotParticipateAsAttacker, type),
    cannotParticipateAsDefender: (type: string = 'both') =>
        EffectBuilder.card.static(EffectName.CannotParticipateAsDefender, type),
    cannotReceiveDishonorToken: () => cardCannot('receiveDishonorToken'),
    cannotReceiveHonorToken: () => cardCannot('receiveHonorToken'),
    cannotReceiveTaintedToken: () => cardCannot('receiveTaintedToken'),
    cannotTriggerAbilities: () => cardCannot('triggerAbilities'),
    cardCannot,
    changeContributionFunction: (func: (card: DrawCard) => number) => EffectBuilder.card.static(EffectName.ChangeContributionFunction, func),
    changeType: (type: CardType) => EffectBuilder.card.static(EffectName.ChangeType, type),
    contributeToConflict: (player: Flexible<Player>) => EffectBuilder.card.flexible(EffectName.ContributeToConflict, player),
    canContributeWhileBowed: () => EffectBuilder.card.static(EffectName.CanContributeWhileBowed, true),
    canContributeGloryWhileBowed: () => EffectBuilder.card.static(EffectName.CanContributeGloryWhileBowed, true),
    copyCard,
    copyProvince,
    customDetachedCard: <S>(properties: DetachedValue<BaseCard, S>) => EffectBuilder.card.detached(EffectName.CustomEffect, properties),
    customRefillProvince: (refillFunc: EffectValueMap[EffectName.CustomProvinceRefillEffect]) => EffectBuilder.card.static(EffectName.CustomProvinceRefillEffect, refillFunc),
    delayedEffect: (properties: DelayedEffectValue) => EffectBuilder.card.static(EffectName.DelayedEffect, properties),
    doesNotBow: () => EffectBuilder.card.static(EffectName.DoesNotBow, true),
    doesNotReady: () => EffectBuilder.card.static(EffectName.DoesNotReady, true),
    entersPlayWithStatus: (status: EffectValueMap[EffectName.EntersPlayWithStatus]) => EffectBuilder.card.static(EffectName.EntersPlayWithStatus, status),
    entersPlayForOpponent: () => EffectBuilder.card.static(EffectName.EntersPlayForOpponent, true),
    fateCostToAttack: (amount: Flexible<number> = 1) => EffectBuilder.card.flexible(EffectName.FateCostToAttack, amount),
    cardCostToAttackMilitary: (amount: Flexible<number> = 1) => EffectBuilder.card.flexible(EffectName.CardCostToAttackMilitary, amount),
    honorCostToDeclare: (properties: EffectValueMap[EffectName.HonorCostToDeclare] = { amount: 1, dueToStatusToken: false }) => EffectBuilder.card.static(EffectName.HonorCostToDeclare, properties),
    fateCostToRingToDeclareConflictAgainst: (amount: Flexible<number> = 1) =>
        EffectBuilder.card.flexible(EffectName.FateCostToRingToDeclareConflictAgainst, amount),
    fateCostToTarget: (properties: Flexible<EffectValueMap[EffectName.FateCostToTarget]>) => EffectBuilder.card.flexible(EffectName.FateCostToTarget, properties),
    gainAbility,
    gainAllAbilities,
    gainAllAbilitiesDynamic: (match: DynamicMatch, printedAbilitiesOnly = false) =>
        EffectBuilder.card.static(EffectName.GainAllAbilitiesDynamic, new GainAllAbiliitesDynamic(match, printedAbilitiesOnly)),
    gainExtraFateWhenPlayed: (amount: Flexible<number> = 1) => EffectBuilder.card.flexible(EffectName.GainExtraFateWhenPlayed, amount),
    gainPlayAction: (playActionClass: new (card: DrawCard) => BaseAction) =>
        EffectBuilder.card.detached(EffectName.GainPlayAction, {
            apply: (card: DrawCard) => {
                const action = new playActionClass(card);
                card.abilities.playActions.push(action);
                return action;
            },
            unapply: (card, _context, playAction) =>
                (card.abilities.playActions = card.abilities.playActions.filter((action) => action !== playAction))
        }),
    hideWhenFaceUp: () => EffectBuilder.card.static(EffectName.HideWhenFaceUp, true),
    honorStatusDoesNotAffectLeavePlay: () => EffectBuilder.card.flexible(EffectName.HonorStatusDoesNotAffectLeavePlay, true),
    honorStatusDoesNotModifySkill: () => EffectBuilder.card.flexible(EffectName.HonorStatusDoesNotModifySkill, true),
    taintedStatusDoesNotCostHonor: () => EffectBuilder.card.flexible(EffectName.TaintedStatusDoesNotCostHonor, true),
    honorStatusReverseModifySkill: () => EffectBuilder.card.flexible(EffectName.HonorStatusReverseModifySkill, true),
    immunity: (properties: string | RestrictionProperties) => EffectBuilder.card.static(EffectName.AbilityRestrictions, new Restriction(properties)),
    increaseLimitOnAbilities: (abilities?: AbilityLimitIncrease) => EffectBuilder.card.static(EffectName.IncreaseLimitOnAbilities, abilities ?? true),
    increaseLimitOnPrintedAbilities: (abilities?: EffectValueMap[EffectName.IncreaseLimitOnPrintedAbilities]) =>
        EffectBuilder.card.static(EffectName.IncreaseLimitOnPrintedAbilities, abilities ?? true),
    legendaryFate: (amount: Flexible<number> = 1) => EffectBuilder.card.flexible(EffectName.LegendaryFate, amount),
    loseAllNonKeywordAbilities: () => EffectBuilder.card.static(EffectName.LoseAllNonKeywordAbilities, true),
    loseKeyword: (keyword: string) => EffectBuilder.card.static(EffectName.LoseKeyword, keyword),
    loseTrait: (trait: string) => EffectBuilder.card.static(EffectName.LoseTrait, trait),
    modifyBaseMilitarySkillMultiplier: (value: Flexible<number>) =>
        EffectBuilder.card.flexible(EffectName.ModifyBaseMilitarySkillMultiplier, value),
    modifyBasePoliticalSkillMultiplier: (value: Flexible<number>) =>
        EffectBuilder.card.flexible(EffectName.ModifyBasePoliticalSkillMultiplier, value),
    modifyBaseProvinceStrength: (value: Flexible<number>) => EffectBuilder.card.flexible(EffectName.ModifyBaseProvinceStrength, value),
    modifyBothSkills: (value: Flexible<number>) => EffectBuilder.card.flexible(EffectName.ModifyBothSkills, value),
    modifyDuelistSkill,
    modifyGlory: (value: Flexible<number>) => EffectBuilder.card.flexible(EffectName.ModifyGlory, value),
    modifyMilitarySkill: (value: Flexible<number>) => EffectBuilder.card.flexible(EffectName.ModifyMilitarySkill, value),
    switchAttachmentSkillModifiers,
    attachmentMilitarySkillModifier,
    modifyMilitarySkillMultiplier: (value: Flexible<number>) =>
        EffectBuilder.card.flexible(EffectName.ModifyMilitarySkillMultiplier, value),
    modifyPoliticalSkill: (value: Flexible<number>) => EffectBuilder.card.flexible(EffectName.ModifyPoliticalSkill, value),
    attachmentPoliticalSkillModifier,
    modifyPoliticalSkillMultiplier: (value: Flexible<number>) =>
        EffectBuilder.card.flexible(EffectName.ModifyPoliticalSkillMultiplier, value),
    modifyProvinceStrength: (value: Flexible<number>) => EffectBuilder.card.flexible(EffectName.ModifyProvinceStrength, value),
    modifyProvinceStrengthMultiplier: (value: Flexible<number>) =>
        EffectBuilder.card.flexible(EffectName.ModifyProvinceStrengthMultiplier, value),
    modifyProvinceStrengthBonus: (value: Flexible<number>) => EffectBuilder.card.flexible(EffectName.ModifyProvinceStrengthBonus, value),
    modifyRestrictedAttachmentAmount: (value: Flexible<number>) =>
        EffectBuilder.card.flexible(EffectName.ModifyRestrictedAttachmentAmount, value),
    mustBeChosen: (properties: RestrictionProperties) =>
        EffectBuilder.card.static(
            EffectName.MustBeChosen,
            new Restriction(Object.assign({ type: 'target' }, properties))
        ),
    mustBeDeclaredAsAttacker,
    mustBeDeclaredAsAttackerIfType: (type: string = 'both') =>
        EffectBuilder.card.static(EffectName.MustBeDeclaredAsAttackerIfType, type),
    mustBeDeclaredAsDefender: (type: string = 'both') => EffectBuilder.card.static(EffectName.MustBeDeclaredAsDefender, type),
    refillProvinceTo: (refillAmount: Flexible<number>) => EffectBuilder.card.flexible(EffectName.RefillProvinceTo, refillAmount),
    setApparentFate: (value: number) => EffectBuilder.card.static(EffectName.SetApparentFate, value),
    setBaseDash: (type: DashSkillType) => EffectBuilder.card.static(EffectName.SetBaseDash, type),
    setBaseMilitarySkill: (value: number) => EffectBuilder.card.static(EffectName.SetBaseMilitarySkill, value),
    setBasePoliticalSkill: (value: number) => EffectBuilder.card.static(EffectName.SetBasePoliticalSkill, value),
    setBaseProvinceStrength: (value: number) => EffectBuilder.card.static(EffectName.SetBaseProvinceStrength, value),
    setDash: (type: DashSkillType) => EffectBuilder.card.static(EffectName.SetDash, type),
    setGlory: (value: number) => EffectBuilder.card.static(EffectName.SetGlory, value),
    setBaseGlory: (value: number) => EffectBuilder.card.static(EffectName.SetBaseGlory, value),
    setMilitarySkill: (value: number) => EffectBuilder.card.static(EffectName.SetMilitarySkill, value),
    setPoliticalSkill: (value: number) => EffectBuilder.card.static(EffectName.SetPoliticalSkill, value),
    setProvinceStrength: (value: number) => EffectBuilder.card.static(EffectName.SetProvinceStrength, value),
    setProvinceStrengthBonus: (value: Flexible<number>) => EffectBuilder.card.flexible(EffectName.SetProvinceStrengthBonus, value),
    provinceCannotHaveSkillIncreased: () => EffectBuilder.card.static(EffectName.ProvinceCannotHaveSkillIncreased, true),
    switchBaseSkills: () => EffectBuilder.card.static(EffectName.SwitchBaseSkills, true),
    suppressEffects: (condition: (effect: EffectBase) => boolean) =>
        EffectBuilder.card.static(EffectName.SuppressEffects, new SuppressEffect(condition)),
    takeControl: (player: Player | undefined) => EffectBuilder.card.static(EffectName.TakeControl, player),
    triggersAbilitiesFromHome: (properties: object) =>
        EffectBuilder.card.static(EffectName.TriggersAbilitiesFromHome, properties),
    participatesFromHome: () => EffectBuilder.card.static(EffectName.ParticipatesFromHome, true),
    unlessActionCost: (properties: UnlessActionCostValue) => EffectBuilder.card.static(EffectName.UnlessActionCost, properties),
    replacePrintedElement: (value: EffectValueMap[EffectName.ReplacePrintedElement]) => EffectBuilder.card.static(EffectName.ReplacePrintedElement, value),
    winDuel: (duel: Duel) => EffectBuilder.card.static(EffectName.WinDuel, duel),
    winDuelTies: () => EffectBuilder.card.static(EffectName.WinDuelTies, true),
    ignoreDuelSkill: () => EffectBuilder.card.static(EffectName.IgnoreDuelSkill, true),
    payPrintedCostToOpponent: () => EffectBuilder.card.static(EffectName.PayPrintedCostToOpponent, true),
    // Ring effects
    addElement: (element: Flexible<Element | Element[], Ring>) => EffectBuilder.ring.flexible(EffectName.AddElement, element),
    cannotBidInDuels: (num: number | string) => EffectBuilder.player.static(EffectName.CannotBidInDuels, num),
    cannotDeclareRing: (match: (player: Player) => boolean) => EffectBuilder.ring.static(EffectName.CannotDeclareRing, match),
    considerRingAsClaimed: (match: (player: Player) => boolean) => EffectBuilder.ring.static(EffectName.ConsiderRingAsClaimed, match),
    // Player effects
    additionalAction: (amount: number = 1) => EffectBuilder.player.static(EffectName.AdditionalAction, amount),
    additionalCardPlayed: (amount: Flexible<number, Player> = 1) => EffectBuilder.player.flexible(EffectName.AdditionalCardPlayed, amount),
    additionalCharactersInConflict: (amount: Flexible<number, Player>) =>
        EffectBuilder.player.flexible(EffectName.AdditionalCharactersInConflict, amount),
    additionalConflict: (type?: string) => EffectBuilder.player.static(EffectName.AdditionalConflict, type ?? true),
    additionalTriggerCost: (func: EffectValueMap[EffectName.AdditionalTriggerCost]) => EffectBuilder.player.static(EffectName.AdditionalTriggerCost, func),
    additionalPlayCost: (func: EffectValueMap[EffectName.AdditionalPlayCost]) => EffectBuilder.player.static(EffectName.AdditionalPlayCost, func),
    alternateFatePool: (match: EffectValueMap[EffectName.AlternateFatePool]) => EffectBuilder.player.static(EffectName.AlternateFatePool, match),
    cannotDeclareConflictsOfType: (type: string) => EffectBuilder.player.static(EffectName.CannotDeclareConflictsOfType, type),
    canPlayFromOwn,
    canPlayFromOpponents: (location: Location, cards: DrawCard[], sourceOfEffect: BaseCard, playType: PlayType = PlayType.PlayFromHand) =>
        EffectBuilder.player.detached(EffectName.CanPlayFromOpponents, {
            apply: (p) => {
                if(!p.opponent) {
                    return;
                }
                for(const card of cards.filter(
                    (card) => card.type === CardType.Event && card.location === location
                )) {
                    for(const reaction of card.reactions) {
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
            unapply: (player, context, location) => {
                if(!location) {
                    return;
                }
                player.removePlayableLocation(location);
                for(const card of location.cards) {
                    if(Array.isArray(card.fromOutOfPlaySource)) {
                        card.fromOutOfPlaySource.filter((a) => a !== context.source);
                        if(card.fromOutOfPlaySource.length === 0) {
                            delete card.fromOutOfPlaySource;
                        }
                    }
                }
            }
        }),
    limitHonorGainPerPhase: (amount: number) => EffectBuilder.player.static(EffectName.LimitHonorGainPerPhase, amount),
    modifyHonorTransferGiven: (amount: number) => EffectBuilder.player.static(EffectName.ModifyHonorTransferGiven, amount),
    modifyHonorTransferReceived: (amount: number) =>
        EffectBuilder.player.static(EffectName.ModifyHonorTransferReceived, amount),
    cannotResolveRings: () => EffectBuilder.player.static(EffectName.CannotResolveRings, true),
    changePlayerGloryModifier,
    changePlayerSkillModifier: (value: Flexible<number, Player>) => EffectBuilder.player.flexible(EffectName.ChangePlayerSkillModifier, value),
    customDetachedPlayer: <S>(properties: DetachedValue<Player, S>) => EffectBuilder.player.detached(EffectName.CustomEffect, properties),
    gainActionPhasePriority: () =>
        EffectBuilder.player.detached(EffectName.GainActionPhasePriority, {
            apply: (player) => (player.actionPhasePriority = true),
            unapply: (player) => (player.actionPhasePriority = false)
        }),
    increaseCost: (properties: Omit<CostReducerProps, 'amount'> & { amount: number }) =>
        reduceCost(Object.assign({}, properties, { amount: -properties.amount })),
    modifyCardsDrawnInDrawPhase: (amount: Flexible<number, Player>) =>
        EffectBuilder.player.flexible(EffectName.ModifyCardsDrawnInDrawPhase, amount),
    playerCannot: (properties: string | RestrictionProperties) =>
        EffectBuilder.player.static(
            EffectName.AbilityRestrictions,
            new Restriction(
                typeof properties === 'string'
                    ? { type: properties }
                    : Object.assign({ type: (properties.cannot ?? properties.type) }, properties)
            )
        ),
    playerDelayedEffect: (properties: DelayedEffectValue) => EffectBuilder.player.static(EffectName.DelayedEffect, properties),
    playerFateCostToTargetCard: (properties: Flexible<EffectValueMap[EffectName.PlayerFateCostToTargetCard], Player>) =>
        EffectBuilder.player.flexible(
            EffectName.PlayerFateCostToTargetCard,
            properties
        ),
    reduceCost,
    reduceNextPlayedCardCost: (amount: CostReducerProps['amount'], match?: CostReducerProps['match']) =>
        EffectBuilder.player.detached(EffectName.CostReducer, {
            apply: (player, context) =>
                player.addCostReducer(context.source, { amount: amount, match: match, limit: AbilityLimit.fixed(1) }),
            unapply: (player, _context, reducer) => player.removeCostReducer(reducer)
        }),
    satisfyAffinity: (traits: string | string[]) => EffectBuilder.player.static(EffectName.SatisfyAffinity, traits),
    setConflictDeclarationType: (type: ConflictType) => EffectBuilder.player.static(EffectName.SetConflictDeclarationType, type),
    provideConflictDeclarationType: (type: ConflictType) =>
        EffectBuilder.player.static(EffectName.ProvideConflictDeclarationType, type),
    forceConflictDeclarationType: (type: ConflictType) => EffectBuilder.player.static(EffectName.ForceConflictDeclarationType, type),
    setMaxConflicts: (amount: number) => EffectBuilder.player.static(EffectName.SetMaxConflicts, amount),
    setConflictTotalSkill: (value: number) => EffectBuilder.player.static(EffectName.SetConflictTotalSkill, value),
    showTopConflictCard: (players: Players = Players.Any) =>
        EffectBuilder.player.static(EffectName.ShowTopConflictCard, players),
    showTopDynastyCard: () => EffectBuilder.player.static(EffectName.ShowTopDynastyCard, true),
    eventsCannotBeCancelled: () => EffectBuilder.player.static(EffectName.EventsCannotBeCancelled, true),
    mustDeclareMaximumAttackers: (type: string = 'both') =>
        EffectBuilder.player.static(EffectName.MustDeclareMaximumAttackers, type),
    restartDynastyPhase: (source: BaseCard) => EffectBuilder.player.static(EffectName.RestartDynastyPhase, source),
    strongholdCanBeAttacked: () => EffectBuilder.player.static(EffectName.StrongholdCanBeAttacked, true),
    defendersChosenFirstDuringConflict: (amountOfAttackers: number) =>
        EffectBuilder.player.static(EffectName.DefendersChosenFirstDuringConflict, amountOfAttackers),
    costToDeclareAnyParticipants: (properties: ParticipantCostEffect) =>
        EffectBuilder.player.static(EffectName.CostToDeclareAnyParticipants, properties),
    consideredLessHonorable: () => EffectBuilder.player.static(EffectName.ConsideredLessHonorable, true),
    customFatePhaseFateRemoval: (refillFunc: EffectValueMap[EffectName.CustomFatePhaseFateRemoval]) =>
        EffectBuilder.player.static(EffectName.CustomFatePhaseFateRemoval, refillFunc),
    changeConflictSkillFunctionPlayer: (func: EffectValueMap[EffectName.ChangeConflictSkillFunction]) =>
        EffectBuilder.player.static(EffectName.ChangeConflictSkillFunction, func),
    limitLegalAttackers: (matchFunc: (card: DrawCard) => boolean) => EffectBuilder.player.static(EffectName.LimitLegalAttackers, matchFunc),
    additionalActionAfterWindowCompleted: (amount: number = 1) =>
        EffectBuilder.player.static(EffectName.AdditionalActionAfterWindowCompleted, amount),
    // Conflict effects
    charactersCannot: (properties: string | RestrictionProperties) =>
        EffectBuilder.conflict.static(
            EffectName.AbilityRestrictions,
            new Restriction(
                typeof properties === 'string'
                    ? { restricts: 'characters', type: properties }
                    : Object.assign({ restricts: 'characters', type: (properties.cannot ?? properties.type) }, properties)
            )
        ),
    cannotContribute: (func: (conflict: Conflict, context: AbilityContext) => (card: DrawCard) => boolean) =>
        EffectBuilder.conflict.dynamic(EffectName.CannotContribute, func),
    changeConflictSkillFunction: (func: EffectValueMap[EffectName.ChangeConflictSkillFunction]) => EffectBuilder.conflict.static(EffectName.ChangeConflictSkillFunction, func),
    modifyConflictElementsToResolve: (value: number) =>
        EffectBuilder.conflict.static(EffectName.ModifyConflictElementsToResolve, value),
    restrictNumberOfDefenders: (value: number) => EffectBuilder.conflict.static(EffectName.RestrictNumberOfDefenders, value),
    resolveConflictEarly: () => EffectBuilder.player.static(EffectName.ResolveConflictEarly, true),
    forceConflictUnopposed: () => EffectBuilder.conflict.static(EffectName.ForceConflictUnopposed, true),
    modifyUnopposedHonorLoss: (amount: number = 1) =>
        EffectBuilder.conflict.static(EffectName.ModifyUnopposedHonorLoss, amount),
    additionalAttackedProvince: (province: EffectValueMap[EffectName.AdditionalAttackedProvince]) =>
        EffectBuilder.conflict.static(EffectName.AdditionalAttackedProvince, province),
    conflictIgnoreStatusTokens: () => EffectBuilder.conflict.static(EffectName.ConflictIgnoreStatusTokens, true),
    // Duel effects
    modifyDuelSkill: (properties: { player?: Player; amount: number }) =>
        EffectBuilder.duel.static(EffectName.ModifyDuelSkill, { player: properties.player, amount: properties.amount }),
    applyStatusTokensToDuel: () => EffectBuilder.duel.static(EffectName.ApplyStatusTokensToDuel, true),
    duelIgnorePrintedSkill: () => EffectBuilder.duel.static(EffectName.DuelIgnorePrintedSkill, true)
};

export default Effects;
