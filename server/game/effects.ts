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
import { copyCard } from './Effects/Library/copyCard.js';
import { gainAllAbilities } from './Effects/Library/gainAllAbilities.js';
import { gainAbility } from './Effects/Library/gainAbility.js';
import { mustBeDeclaredAsAttacker } from './Effects/Library/mustBeDeclaredAsAttacker.js';
import { reduceCost } from './Effects/Library/reduceCost.js';
import { switchAttachmentSkillModifiers } from './Effects/Library/switchAttachmentSkillModifiers.js';
import { EffectName, PlayType, CardType, Players } from './Constants.js';

/* Types of effect
    1. Static effects - do something for a period
    2. Dynamic effects - like static, but what they do depends on the game state
    3. Detached effects - do something when applied, and on expiration, but can be ignored in the interim
*/

type Flexible<T> = T | ((...args: any[]) => T);

const Effects = {
    // Card effects
    addElementAsAttacker: (element: Flexible<string>) => EffectBuilder.card.flexible(EffectName.AddElementAsAttacker, element),
    addFaction: (faction: string) => EffectBuilder.card.static(EffectName.AddFaction, faction),
    loseFaction: (faction: string) => EffectBuilder.card.static(EffectName.LoseFaction, faction),
    addKeyword: (keyword: string) => EffectBuilder.card.static(EffectName.AddKeyword, keyword),
    addTrait: (trait: string) => EffectBuilder.card.static(EffectName.AddTrait, trait),
    additionalTriggerCostForCard: (func: any) => EffectBuilder.card.static(EffectName.AdditionalTriggerCost, func),
    attachmentCardCondition: (func: any) => EffectBuilder.card.static(EffectName.AttachmentCardCondition, func),
    attachmentFactionRestriction: (factions: any) =>
        EffectBuilder.card.static(EffectName.AttachmentFactionRestriction, factions),
    attachmentLimit: (amount: number) => EffectBuilder.card.static(EffectName.AttachmentLimit, amount),
    attachmentMyControlOnly: () => EffectBuilder.card.static(EffectName.AttachmentMyControlOnly, true),
    attachmentOpponentControlOnly: () => EffectBuilder.card.static(EffectName.AttachmentOpponentControlOnly, true),
    attachmentRestrictTraitAmount: (object: any) =>
        EffectBuilder.card.static(EffectName.AttachmentRestrictTraitAmount, object),
    attachmentTraitRestriction: (traits: any) => EffectBuilder.card.static(EffectName.AttachmentTraitRestriction, traits),
    attachmentUniqueRestriction: () => EffectBuilder.card.static(EffectName.AttachmentUniqueRestriction, true),
    blank: (blankTraits: boolean = false) => EffectBuilder.card.static(EffectName.Blank, blankTraits),
    calculatePrintedMilitarySkill: (func: any) => EffectBuilder.card.static(EffectName.CalculatePrintedMilitarySkill, func),
    canPlayFromOutOfPlay: (player: any, playType: PlayType = PlayType.PlayFromHand) =>
        EffectBuilder.card.flexible(
            EffectName.CanPlayFromOutOfPlay,
            Object.assign({ player: player, playType: playType })
        ),
    registerToPlayFromOutOfPlay: () =>
        EffectBuilder.card.detached(EffectName.CanPlayFromOutOfPlay, {
            apply: (card: any) => {
                for(const reaction of card.reactions) {
                    reaction.registerEvents();
                }
            },
            unapply: () => true
        }),
    canBeSeenWhenFacedown: () => EffectBuilder.card.static(EffectName.CanBeSeenWhenFacedown, true),
    canBeTriggeredByOpponent: () => EffectBuilder.card.static(EffectName.CanBeTriggeredByOpponent, true),
    canOnlyBeDeclaredAsAttackerWithElement: (element: Flexible<string>) =>
        EffectBuilder.card.flexible(EffectName.CanOnlyBeDeclaredAsAttackerWithElement, element),
    cannotApplyLastingEffects: (condition: any) =>
        EffectBuilder.card.static(EffectName.CannotApplyLastingEffects, condition),
    cannotBeAttacked: () => EffectBuilder.card.static(EffectName.CannotBeAttacked, true),
    cannotHaveConflictsDeclaredOfType: (type: Flexible<string>) =>
        EffectBuilder.card.flexible(EffectName.CannotHaveConflictsDeclaredOfType, type),
    cannotHaveOtherRestrictedAttachments: (card: any) =>
        EffectBuilder.card.static(EffectName.CannotHaveOtherRestrictedAttachments, card),
    cannotParticipateAsAttacker: (type: string = 'both') =>
        EffectBuilder.card.static(EffectName.CannotParticipateAsAttacker, type),
    cannotParticipateAsDefender: (type: string = 'both') =>
        EffectBuilder.card.static(EffectName.CannotParticipateAsDefender, type),
    cardCannot,
    changeContributionFunction: (func: any) => EffectBuilder.card.static(EffectName.ChangeContributionFunction, func),
    changeType: (type: CardType) => EffectBuilder.card.static(EffectName.ChangeType, type),
    characterProvidesAdditionalConflict: (type: string) =>
        EffectBuilder.card.detached(EffectName.AdditionalConflict, {
            apply: (card: any) => card.controller.addConflictOpportunity(type),
            unapply: (card: any) => card.controller.removeConflictOpportunity(type)
        }),
    contributeToConflict: (player: any) => EffectBuilder.card.flexible(EffectName.ContributeToConflict, player),
    canContributeWhileBowed: (properties?: any) => EffectBuilder.card.static(EffectName.CanContributeWhileBowed, properties),
    canContributeGloryWhileBowed: (properties?: any) =>
        EffectBuilder.card.static(EffectName.CanContributeGloryWhileBowed, properties),
    copyCard,
    customDetachedCard: (properties: any) => EffectBuilder.card.detached(EffectName.CustomEffect, properties),
    customRefillProvince: (refillFunc: any) => EffectBuilder.card.static(EffectName.CustomProvinceRefillEffect, refillFunc),
    delayedEffect: (properties: any) => EffectBuilder.card.static(EffectName.DelayedEffect, properties),
    doesNotBow: () => EffectBuilder.card.static(EffectName.DoesNotBow, true),
    doesNotReady: () => EffectBuilder.card.static(EffectName.DoesNotReady, true),
    entersPlayWithStatus: (status: any) => EffectBuilder.card.static(EffectName.EntersPlayWithStatus, status),
    entersPlayForOpponent: () => EffectBuilder.card.static(EffectName.EntersPlayForOpponent, true),
    fateCostToAttack: (amount: Flexible<number> = 1) => EffectBuilder.card.flexible(EffectName.FateCostToAttack, amount),
    cardCostToAttackMilitary: (amount: Flexible<number> = 1) => EffectBuilder.card.flexible(EffectName.CardCostToAttackMilitary, amount),
    honorCostToDeclare: (amount: Flexible<number> = 1) => EffectBuilder.card.flexible(EffectName.HonorCostToDeclare, amount),
    fateCostToRingToDeclareConflictAgainst: (amount: Flexible<number> = 1) =>
        EffectBuilder.card.flexible(EffectName.FateCostToRingToDeclareConflictAgainst, amount),
    fateCostToTarget: (properties: any) => EffectBuilder.card.flexible(EffectName.FateCostToTarget, properties),
    gainAbility,
    gainAllAbilities,
    gainAllAbilitiesDynamic: (match: any) =>
        EffectBuilder.card.static(EffectName.GainAllAbilitiesDynamic, new GainAllAbiliitesDynamic(match)),
    gainExtraFateWhenPlayed: (amount: Flexible<number> = 1) => EffectBuilder.card.flexible(EffectName.GainExtraFateWhenPlayed, amount),
    gainPlayAction: (playActionClass: any) =>
        EffectBuilder.card.detached(EffectName.GainPlayAction, {
            apply: (card: any) => {
                const action = new playActionClass(card);
                card.abilities.playActions.push(action);
                return action;
            },
            unapply: (card: any, context: any, playAction: any) =>
                (card.abilities.playActions = card.abilities.playActions.filter((action: any) => action !== playAction))
        }),
    hideWhenFaceUp: () => EffectBuilder.card.static(EffectName.HideWhenFaceUp, true),
    honorStatusDoesNotAffectLeavePlay: () => EffectBuilder.card.flexible(EffectName.HonorStatusDoesNotAffectLeavePlay, true),
    honorStatusDoesNotModifySkill: () => EffectBuilder.card.flexible(EffectName.HonorStatusDoesNotModifySkill, true),
    taintedStatusDoesNotCostHonor: () => EffectBuilder.card.flexible(EffectName.TaintedStatusDoesNotCostHonor, true),
    honorStatusReverseModifySkill: () => EffectBuilder.card.flexible(EffectName.HonorStatusReverseModifySkill, true),
    immunity: (properties: any) => EffectBuilder.card.static(EffectName.AbilityRestrictions, new Restriction(properties)),
    increaseLimitOnAbilities: (abilities?: any) => EffectBuilder.card.static(EffectName.IncreaseLimitOnAbilities, abilities),
    increaseLimitOnPrintedAbilities: (abilities?: any) =>
        EffectBuilder.card.static(EffectName.IncreaseLimitOnPrintedAbilities, abilities),
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
    modifyDuelistSkill: (value: Flexible<number>, duel?: any) => EffectBuilder.card.flexible(EffectName.ModifyDuelistSkill, duel !== undefined ? { value, duel } : value),
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
    mustBeChosen: (properties: any) =>
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
    setBaseDash: (type: any) => EffectBuilder.card.static(EffectName.SetBaseDash, type),
    setBaseMilitarySkill: (value: number) => EffectBuilder.card.static(EffectName.SetBaseMilitarySkill, value),
    setBasePoliticalSkill: (value: number) => EffectBuilder.card.static(EffectName.SetBasePoliticalSkill, value),
    setBaseProvinceStrength: (value: number) => EffectBuilder.card.static(EffectName.SetBaseProvinceStrength, value),
    setDash: (type: any) => EffectBuilder.card.static(EffectName.SetDash, type),
    setGlory: (value: number) => EffectBuilder.card.static(EffectName.SetGlory, value),
    setBaseGlory: (value: number) => EffectBuilder.card.static(EffectName.SetBaseGlory, value),
    setMilitarySkill: (value: number) => EffectBuilder.card.static(EffectName.SetMilitarySkill, value),
    setPoliticalSkill: (value: number) => EffectBuilder.card.static(EffectName.SetPoliticalSkill, value),
    setProvinceStrength: (value: number) => EffectBuilder.card.static(EffectName.SetProvinceStrength, value),
    setProvinceStrengthBonus: (value: Flexible<number>) => EffectBuilder.card.flexible(EffectName.SetProvinceStrengthBonus, value),
    provinceCannotHaveSkillIncreased: (value?: any) =>
        EffectBuilder.card.static(EffectName.ProvinceCannotHaveSkillIncreased, value),
    switchBaseSkills: () => EffectBuilder.card.static(EffectName.SwitchBaseSkills, true),
    suppressEffects: (condition: any) =>
        EffectBuilder.card.static(EffectName.SuppressEffects, new SuppressEffect(condition)),
    takeControl: (player: any) => EffectBuilder.card.static(EffectName.TakeControl, player),
    triggersAbilitiesFromHome: (properties: any) =>
        EffectBuilder.card.static(EffectName.TriggersAbilitiesFromHome, properties),
    participatesFromHome: (properties?: any) => EffectBuilder.card.static(EffectName.ParticipatesFromHome, properties),
    unlessActionCost: (properties: any) => EffectBuilder.card.static(EffectName.UnlessActionCost, properties),
    replacePrintedElement: (value: any) => EffectBuilder.card.static(EffectName.ReplacePrintedElement, value),
    winDuel: (duel: any) => EffectBuilder.card.static(EffectName.WinDuel, duel),
    winDuelTies: () => EffectBuilder.card.static(EffectName.WinDuelTies, true),
    ignoreDuelSkill: () => EffectBuilder.card.static(EffectName.IgnoreDuelSkill, true),
    // Ring effects
    addElement: (element: Flexible<string | string[]>) => EffectBuilder.ring.flexible(EffectName.AddElement, element),
    cannotBidInDuels: (num: number | string) => EffectBuilder.player.static(EffectName.CannotBidInDuels, num),
    cannotDeclareRing: (match: any) => EffectBuilder.ring.static(EffectName.CannotDeclareRing, match),
    considerRingAsClaimed: (match: any) => EffectBuilder.ring.static(EffectName.ConsiderRingAsClaimed, match),
    // Player effects
    additionalAction: (amount: number = 1) => EffectBuilder.player.static(EffectName.AdditionalAction, amount),
    additionalCardPlayed: (amount: Flexible<number> = 1) => EffectBuilder.player.flexible(EffectName.AdditionalCardPlayed, amount),
    additionalCharactersInConflict: (amount: Flexible<number>) =>
        EffectBuilder.player.flexible(EffectName.AdditionalCharactersInConflict, amount),
    additionalConflict: (type?: string) => EffectBuilder.player.static(EffectName.AdditionalConflict, type),
    additionalTriggerCost: (func: any) => EffectBuilder.player.static(EffectName.AdditionalTriggerCost, func),
    additionalPlayCost: (func: any) => EffectBuilder.player.static(EffectName.AdditionalPlayCost, func),
    alternateFatePool: (match: any) => EffectBuilder.player.static(EffectName.AlternateFatePool, match),
    cannotDeclareConflictsOfType: (type: string) => EffectBuilder.player.static(EffectName.CannotDeclareConflictsOfType, type),
    canPlayFromOwn,
    canPlayFromOpponents: (location: any, cards: any, sourceOfEffect: any, playType: PlayType = PlayType.PlayFromHand) =>
        EffectBuilder.player.detached(EffectName.CanPlayFromOpponents, {
            apply: (player: any) => {
                if(!player.opponent) {
                    return;
                }
                for(const card of cards.filter(
                    (card: any) => card.type === CardType.Event && card.location === location
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
                return player.addPlayableLocation(playType, player.opponent, location, cards);
            },
            unapply: (player: any, context: any, location: any) => {
                player.removePlayableLocation(location);
                for(const card of location.cards) {
                    if(Array.isArray(card.fromOutOfPlaySource)) {
                        card.fromOutOfPlaySource.filter((a: any) => a !== context.source);
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
    changePlayerSkillModifier: (value: Flexible<number>) => EffectBuilder.player.flexible(EffectName.ChangePlayerSkillModifier, value),
    customDetachedPlayer: (properties: any) => EffectBuilder.player.detached(EffectName.CustomEffect, properties),
    gainActionPhasePriority: () =>
        EffectBuilder.player.detached(EffectName.GainActionPhasePriority, {
            apply: (player: any) => (player.actionPhasePriority = true),
            unapply: (player: any) => (player.actionPhasePriority = false)
        }),
    increaseCost: (properties: any) => reduceCost(Object.assign({}, properties, { amount: -properties.amount })),
    modifyCardsDrawnInDrawPhase: (amount: Flexible<number>) =>
        EffectBuilder.player.flexible(EffectName.ModifyCardsDrawnInDrawPhase, amount),
    playerCannot: (properties: any) =>
        EffectBuilder.player.static(
            EffectName.AbilityRestrictions,
            new Restriction(Object.assign({ type: properties.cannot || properties }, properties))
        ),
    playerDelayedEffect: (properties: any) => EffectBuilder.player.static(EffectName.DelayedEffect, properties),
    playerFateCostToTargetCard: (properties: any) =>
        EffectBuilder.player.flexible(
            EffectName.PlayerFateCostToTargetCard,
            properties
        ),
    reduceCost,
    reduceNextPlayedCardCost: (amount: any, match?: any) =>
        EffectBuilder.player.detached(EffectName.CostReducer, {
            apply: (player: any, context: any) =>
                player.addCostReducer(context.source, { amount: amount, match: match, limit: AbilityLimit.fixed(1) }),
            unapply: (player: any, context: any, reducer: any) => player.removeCostReducer(reducer)
        }),
    satisfyAffinity: (traits: any) => EffectBuilder.player.static(EffectName.SatisfyAffinity, traits),
    setConflictDeclarationType: (type: string) => EffectBuilder.player.static(EffectName.SetConflictDeclarationType, type),
    provideConflictDeclarationType: (type: string) =>
        EffectBuilder.player.static(EffectName.ProvideConflictDeclarationType, type),
    forceConflictDeclarationType: (type: string) => EffectBuilder.player.static(EffectName.ForceConflictDeclarationType, type),
    setMaxConflicts: (amount: number) => EffectBuilder.player.static(EffectName.SetMaxConflicts, amount),
    setConflictTotalSkill: (value: number) => EffectBuilder.player.static(EffectName.SetConflictTotalSkill, value),
    showTopConflictCard: (players: Players = Players.Any) =>
        EffectBuilder.player.static(EffectName.ShowTopConflictCard, players),
    showTopDynastyCard: () => EffectBuilder.player.static(EffectName.ShowTopDynastyCard, true),
    eventsCannotBeCancelled: () => EffectBuilder.player.static(EffectName.EventsCannotBeCancelled, true),
    mustDeclareMaximumAttackers: (type: string = 'both') =>
        EffectBuilder.player.static(EffectName.MustDeclareMaximumAttackers, type),
    restartDynastyPhase: (source: any) => EffectBuilder.player.static(EffectName.RestartDynastyPhase, source),
    strongholdCanBeAttacked: () => EffectBuilder.player.static(EffectName.StrongholdCanBeAttacked, true),
    defendersChosenFirstDuringConflict: (amountOfAttackers: number) =>
        EffectBuilder.player.static(EffectName.DefendersChosenFirstDuringConflict, amountOfAttackers),
    costToDeclareAnyParticipants: (properties: any) =>
        EffectBuilder.player.static(EffectName.CostToDeclareAnyParticipants, properties),
    consideredLessHonorable: () => EffectBuilder.player.static(EffectName.ConsideredLessHonorable, true),
    customFatePhaseFateRemoval: (refillFunc: any) =>
        EffectBuilder.player.static(EffectName.CustomFatePhaseFateRemoval, refillFunc),
    changeConflictSkillFunctionPlayer: (func: any) =>
        EffectBuilder.player.static(EffectName.ChangeConflictSkillFunction, func),
    limitLegalAttackers: (matchFunc: any) => EffectBuilder.player.static(EffectName.LimitLegalAttackers, matchFunc),
    additionalActionAfterWindowCompleted: (amount: number = 1) =>
        EffectBuilder.player.static(EffectName.AdditionalActionAfterWindowCompleted, amount),
    // Conflict effects
    charactersCannot: (properties: any) =>
        EffectBuilder.conflict.static(
            EffectName.AbilityRestrictions,
            new Restriction(
                Object.assign({ restricts: 'characters', type: properties.cannot || properties }, properties)
            )
        ),
    cannotContribute: (func: any) => EffectBuilder.conflict.dynamic(EffectName.CannotContribute, func),
    changeConflictSkillFunction: (func: any) => EffectBuilder.conflict.static(EffectName.ChangeConflictSkillFunction, func),
    modifyConflictElementsToResolve: (value: number) =>
        EffectBuilder.conflict.static(EffectName.ModifyConflictElementsToResolve, value),
    restrictNumberOfDefenders: (value: number) => EffectBuilder.conflict.static(EffectName.RestrictNumberOfDefenders, value),
    resolveConflictEarly: () => EffectBuilder.player.static(EffectName.ResolveConflictEarly, true),
    forceConflictUnopposed: () => EffectBuilder.conflict.static(EffectName.ForceConflictUnopposed, true),
    modifyUnopposedHonorLoss: (amount: number = 1) =>
        EffectBuilder.conflict.static(EffectName.ModifyUnopposedHonorLoss, amount),
    additionalAttackedProvince: (province: any) =>
        EffectBuilder.conflict.static(EffectName.AdditionalAttackedProvince, province),
    conflictIgnoreStatusTokens: () => EffectBuilder.conflict.static(EffectName.ConflictIgnoreStatusTokens, true),
    // Duel effects
    modifyDuelSkill: (properties: any) =>
        EffectBuilder.duel.flexible(
            EffectName.ModifyDuelSkill,
            Object.assign({ player: properties.player, amount: properties.amount })
        ),
    applyStatusTokensToDuel: () => EffectBuilder.duel.static(EffectName.ApplyStatusTokensToDuel, true),
    duelIgnorePrintedSkill: () => EffectBuilder.duel.static(EffectName.DuelIgnorePrintedSkill, true)
};

export default Effects;
