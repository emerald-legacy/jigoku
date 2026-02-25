import * as AbilityLimit from './AbilityLimit';
import GainAllAbiliitesDynamic from './Effects/GainAllAbilitiesDynamic.js';
import Restriction from './Effects/restriction.js';
import { SuppressEffect } from './Effects/SuppressEffect';
import { EffectBuilder } from './Effects/EffectBuilder';
import { attachmentMilitarySkillModifier } from './Effects/Library/attachmentMilitarySkillModifier';
import { attachmentPoliticalSkillModifier } from './Effects/Library/attachmentPoliticalSkillModifier';
import { canPlayFromOwn } from './Effects/Library/canPlayFromOwn';
import { cardCannot } from './Effects/Library/cardCannot';
import { changePlayerGloryModifier } from './Effects/Library/changePlayerGloryModifier';
import { copyCard } from './Effects/Library/copyCard';
import { gainAllAbilities } from './Effects/Library/gainAllAbilities';
import { gainAbility } from './Effects/Library/gainAbility';
import { mustBeDeclaredAsAttacker } from './Effects/Library/mustBeDeclaredAsAttacker';
import { reduceCost } from './Effects/Library/reduceCost';
import { switchAttachmentSkillModifiers } from './Effects/Library/switchAttachmentSkillModifiers';
import { EffectNames, PlayTypes, CardTypes, Players } from './Constants';

/* Types of effect
    1. Static effects - do something for a period
    2. Dynamic effects - like static, but what they do depends on the game state
    3. Detached effects - do something when applied, and on expiration, but can be ignored in the interim
*/

const Effects: Record<string, any> = {
    // Card effects
    addElementAsAttacker: (element: any) => EffectBuilder.card.flexible(EffectNames.AddElementAsAttacker, element),
    addFaction: (faction: any) => EffectBuilder.card.static(EffectNames.AddFaction, faction),
    addKeyword: (keyword: any) => EffectBuilder.card.static(EffectNames.AddKeyword, keyword),
    addTrait: (trait: any) => EffectBuilder.card.static(EffectNames.AddTrait, trait),
    additionalTriggerCostForCard: (func: any) => EffectBuilder.card.static(EffectNames.AdditionalTriggerCost, func),
    attachmentCardCondition: (func: any) => EffectBuilder.card.static(EffectNames.AttachmentCardCondition, func),
    attachmentFactionRestriction: (factions: any) =>
        EffectBuilder.card.static(EffectNames.AttachmentFactionRestriction, factions),
    attachmentLimit: (amount: any) => EffectBuilder.card.static(EffectNames.AttachmentLimit, amount),
    attachmentMyControlOnly: () => EffectBuilder.card.static(EffectNames.AttachmentMyControlOnly, true),
    attachmentOpponentControlOnly: () => EffectBuilder.card.static(EffectNames.AttachmentOpponentControlOnly, true),
    attachmentRestrictTraitAmount: (object: any) =>
        EffectBuilder.card.static(EffectNames.AttachmentRestrictTraitAmount, object),
    attachmentTraitRestriction: (traits: any) => EffectBuilder.card.static(EffectNames.AttachmentTraitRestriction, traits),
    attachmentUniqueRestriction: () => EffectBuilder.card.static(EffectNames.AttachmentUniqueRestriction, true),
    blank: (blankTraits: any = false) => EffectBuilder.card.static(EffectNames.Blank, blankTraits),
    calculatePrintedMilitarySkill: (func: any) => EffectBuilder.card.static(EffectNames.CalculatePrintedMilitarySkill, func),
    canPlayFromOutOfPlay: (player: any, playType: any = PlayTypes.PlayFromHand) =>
        EffectBuilder.card.flexible(
            EffectNames.CanPlayFromOutOfPlay,
            Object.assign({ player: player, playType: playType })
        ),
    registerToPlayFromOutOfPlay: () =>
        EffectBuilder.card.detached(EffectNames.CanPlayFromOutOfPlay, {
            apply: (card: any) => {
                for(const reaction of card.reactions) {
                    reaction.registerEvents();
                }
            },
            unapply: () => true
        }),
    canBeSeenWhenFacedown: () => EffectBuilder.card.static(EffectNames.CanBeSeenWhenFacedown, true),
    canBeTriggeredByOpponent: () => EffectBuilder.card.static(EffectNames.CanBeTriggeredByOpponent, true),
    canOnlyBeDeclaredAsAttackerWithElement: (element: any) =>
        EffectBuilder.card.flexible(EffectNames.CanOnlyBeDeclaredAsAttackerWithElement, element),
    cannotApplyLastingEffects: (condition: any) =>
        EffectBuilder.card.static(EffectNames.CannotApplyLastingEffects, condition),
    cannotBeAttacked: () => EffectBuilder.card.static(EffectNames.CannotBeAttacked, true),
    cannotHaveConflictsDeclaredOfType: (type: any) =>
        EffectBuilder.card.flexible(EffectNames.CannotHaveConflictsDeclaredOfType, type),
    cannotHaveOtherRestrictedAttachments: (card: any) =>
        EffectBuilder.card.static(EffectNames.CannotHaveOtherRestrictedAttachments, card),
    cannotParticipateAsAttacker: (type: any = 'both') =>
        EffectBuilder.card.static(EffectNames.CannotParticipateAsAttacker, type),
    cannotParticipateAsDefender: (type: any = 'both') =>
        EffectBuilder.card.static(EffectNames.CannotParticipateAsDefender, type),
    cardCannot,
    changeContributionFunction: (func: any) => EffectBuilder.card.static(EffectNames.ChangeContributionFunction, func),
    changeType: (type: any) => EffectBuilder.card.static(EffectNames.ChangeType, type),
    characterProvidesAdditionalConflict: (type: any) =>
        EffectBuilder.card.detached(EffectNames.AdditionalConflict, {
            apply: (card: any) => card.controller.addConflictOpportunity(type),
            unapply: (card: any) => card.controller.removeConflictOpportunity(type)
        }),
    contributeToConflict: (player: any) => EffectBuilder.card.flexible(EffectNames.ContributeToConflict, player),
    canContributeWhileBowed: (properties: any) => EffectBuilder.card.static(EffectNames.CanContributeWhileBowed, properties),
    canContributeGloryWhileBowed: (properties: any) =>
        EffectBuilder.card.static(EffectNames.CanContributeGloryWhileBowed, properties),
    copyCard,
    customDetachedCard: (properties: any) => EffectBuilder.card.detached(EffectNames.CustomEffect, properties),
    customRefillProvince: (refillFunc: any) => EffectBuilder.card.static(EffectNames.CustomProvinceRefillEffect, refillFunc),
    delayedEffect: (properties: any) => EffectBuilder.card.static(EffectNames.DelayedEffect, properties),
    doesNotBow: () => EffectBuilder.card.static(EffectNames.DoesNotBow, true),
    doesNotReady: () => EffectBuilder.card.static(EffectNames.DoesNotReady, true),
    entersPlayWithStatus: (status: any) => EffectBuilder.card.static(EffectNames.EntersPlayWithStatus, status),
    entersPlayForOpponent: () => EffectBuilder.card.static(EffectNames.EntersPlayForOpponent, true),
    fateCostToAttack: (amount: any = 1) => EffectBuilder.card.flexible(EffectNames.FateCostToAttack, amount),
    cardCostToAttackMilitary: (amount: any = 1) => EffectBuilder.card.flexible(EffectNames.CardCostToAttackMilitary, amount),
    honorCostToDeclare: (amount: any = 1) => EffectBuilder.card.flexible(EffectNames.HonorCostToDeclare, amount),
    fateCostToRingToDeclareConflictAgainst: (amount: any = 1) =>
        EffectBuilder.card.flexible(EffectNames.FateCostToRingToDeclareConflictAgainst, amount),
    fateCostToTarget: (properties: any) => EffectBuilder.card.flexible(EffectNames.FateCostToTarget, properties),
    gainAbility,
    gainAllAbilities,
    gainAllAbilitiesDynamic: (match: any) =>
        EffectBuilder.card.static(EffectNames.GainAllAbilitiesDynamic, new GainAllAbiliitesDynamic(match)),
    gainExtraFateWhenPlayed: (amount: any = 1) => EffectBuilder.card.flexible(EffectNames.GainExtraFateWhenPlayed, amount),
    gainPlayAction: (playActionClass: any) =>
        EffectBuilder.card.detached(EffectNames.GainPlayAction, {
            apply: (card: any) => {
                const action = new playActionClass(card);
                card.abilities.playActions.push(action);
                return action;
            },
            unapply: (card: any, context: any, playAction: any) =>
                (card.abilities.playActions = card.abilities.playActions.filter((action: any) => action !== playAction))
        }),
    hideWhenFaceUp: () => EffectBuilder.card.static(EffectNames.HideWhenFaceUp, true),
    honorStatusDoesNotAffectLeavePlay: () => EffectBuilder.card.flexible(EffectNames.HonorStatusDoesNotAffectLeavePlay),
    honorStatusDoesNotModifySkill: () => EffectBuilder.card.flexible(EffectNames.HonorStatusDoesNotModifySkill),
    taintedStatusDoesNotCostHonor: () => EffectBuilder.card.flexible(EffectNames.TaintedStatusDoesNotCostHonor),
    honorStatusReverseModifySkill: () => EffectBuilder.card.flexible(EffectNames.HonorStatusReverseModifySkill),
    immunity: (properties: any) => EffectBuilder.card.static(EffectNames.AbilityRestrictions, new Restriction(properties)),
    increaseLimitOnAbilities: (abilities: any) => EffectBuilder.card.static(EffectNames.IncreaseLimitOnAbilities, abilities),
    increaseLimitOnPrintedAbilities: (abilities: any) =>
        EffectBuilder.card.static(EffectNames.IncreaseLimitOnPrintedAbilities, abilities),
    legendaryFate: (amount: any = 1) => EffectBuilder.card.flexible(EffectNames.LegendaryFate, amount),
    loseAllNonKeywordAbilities: () => EffectBuilder.card.static(EffectNames.LoseAllNonKeywordAbilities, true),
    loseKeyword: (keyword: any) => EffectBuilder.card.static(EffectNames.LoseKeyword, keyword),
    loseTrait: (trait: any) => EffectBuilder.card.static(EffectNames.LoseTrait, trait),
    modifyBaseMilitarySkillMultiplier: (value: any) =>
        EffectBuilder.card.flexible(EffectNames.ModifyBaseMilitarySkillMultiplier, value),
    modifyBasePoliticalSkillMultiplier: (value: any) =>
        EffectBuilder.card.flexible(EffectNames.ModifyBasePoliticalSkillMultiplier, value),
    modifyBaseProvinceStrength: (value: any) => EffectBuilder.card.flexible(EffectNames.ModifyBaseProvinceStrength, value),
    modifyBothSkills: (value: any) => EffectBuilder.card.flexible(EffectNames.ModifyBothSkills, value),
    modifyDuelistSkill: (value: any, duel?: any) => EffectBuilder.card.flexible(EffectNames.ModifyDuelistSkill, duel !== undefined ? { value, duel } : value),
    modifyGlory: (value: any) => EffectBuilder.card.flexible(EffectNames.ModifyGlory, value),
    modifyMilitarySkill: (value: any) => EffectBuilder.card.flexible(EffectNames.ModifyMilitarySkill, value),
    switchAttachmentSkillModifiers,
    attachmentMilitarySkillModifier,
    modifyMilitarySkillMultiplier: (value: any) =>
        EffectBuilder.card.flexible(EffectNames.ModifyMilitarySkillMultiplier, value),
    modifyPoliticalSkill: (value: any) => EffectBuilder.card.flexible(EffectNames.ModifyPoliticalSkill, value),
    attachmentPoliticalSkillModifier,
    modifyPoliticalSkillMultiplier: (value: any) =>
        EffectBuilder.card.flexible(EffectNames.ModifyPoliticalSkillMultiplier, value),
    modifyProvinceStrength: (value: any) => EffectBuilder.card.flexible(EffectNames.ModifyProvinceStrength, value),
    modifyProvinceStrengthMultiplier: (value: any) =>
        EffectBuilder.card.flexible(EffectNames.ModifyProvinceStrengthMultiplier, value),
    modifyProvinceStrengthBonus: (value: any) => EffectBuilder.card.flexible(EffectNames.ModifyProvinceStrengthBonus, value),
    modifyRestrictedAttachmentAmount: (value: any) =>
        EffectBuilder.card.flexible(EffectNames.ModifyRestrictedAttachmentAmount, value),
    mustBeChosen: (properties: any) =>
        EffectBuilder.card.static(
            EffectNames.MustBeChosen,
            new Restriction(Object.assign({ type: 'target' }, properties))
        ),
    mustBeDeclaredAsAttacker,
    mustBeDeclaredAsAttackerIfType: (type: any = 'both') =>
        EffectBuilder.card.static(EffectNames.MustBeDeclaredAsAttackerIfType, type),
    mustBeDeclaredAsDefender: (type: any = 'both') => EffectBuilder.card.static(EffectNames.MustBeDeclaredAsDefender, type),
    refillProvinceTo: (refillAmount: any) => EffectBuilder.card.flexible(EffectNames.RefillProvinceTo, refillAmount),
    setApparentFate: (value: any) => EffectBuilder.card.static(EffectNames.SetApparentFate, value),
    setBaseDash: (type: any) => EffectBuilder.card.static(EffectNames.SetBaseDash, type),
    setBaseMilitarySkill: (value: any) => EffectBuilder.card.static(EffectNames.SetBaseMilitarySkill, value),
    setBasePoliticalSkill: (value: any) => EffectBuilder.card.static(EffectNames.SetBasePoliticalSkill, value),
    setBaseProvinceStrength: (value: any) => EffectBuilder.card.static(EffectNames.SetBaseProvinceStrength, value),
    setDash: (type: any) => EffectBuilder.card.static(EffectNames.SetDash, type),
    setGlory: (value: any) => EffectBuilder.card.static(EffectNames.SetGlory, value),
    setBaseGlory: (value: any) => EffectBuilder.card.static(EffectNames.SetBaseGlory, value),
    setMilitarySkill: (value: any) => EffectBuilder.card.static(EffectNames.SetMilitarySkill, value),
    setPoliticalSkill: (value: any) => EffectBuilder.card.static(EffectNames.SetPoliticalSkill, value),
    setProvinceStrength: (value: any) => EffectBuilder.card.static(EffectNames.SetProvinceStrength, value),
    setProvinceStrengthBonus: (value: any) => EffectBuilder.card.flexible(EffectNames.SetProvinceStrengthBonus, value),
    provinceCannotHaveSkillIncreased: (value: any) =>
        EffectBuilder.card.static(EffectNames.ProvinceCannotHaveSkillIncreased, value),
    switchBaseSkills: () => EffectBuilder.card.static(EffectNames.SwitchBaseSkills, true),
    suppressEffects: (condition: any) =>
        EffectBuilder.card.static(EffectNames.SuppressEffects, new SuppressEffect(condition)),
    takeControl: (player: any) => EffectBuilder.card.static(EffectNames.TakeControl, player),
    triggersAbilitiesFromHome: (properties: any) =>
        EffectBuilder.card.static(EffectNames.TriggersAbilitiesFromHome, properties),
    participatesFromHome: (properties: any) => EffectBuilder.card.static(EffectNames.ParticipatesFromHome, properties),
    unlessActionCost: (properties: any) => EffectBuilder.card.static(EffectNames.UnlessActionCost, properties),
    replacePrintedElement: (value: any) => EffectBuilder.card.static(EffectNames.ReplacePrintedElement, value),
    winDuel: (duel: any) => EffectBuilder.card.static(EffectNames.WinDuel, duel),
    winDuelTies: () => EffectBuilder.card.static(EffectNames.WinDuelTies, true),
    ignoreDuelSkill: () => EffectBuilder.card.static(EffectNames.IgnoreDuelSkill, true),
    // Ring effects
    addElement: (element: any) => EffectBuilder.ring.flexible(EffectNames.AddElement, element),
    cannotBidInDuels: (num: any) => EffectBuilder.player.static(EffectNames.CannotBidInDuels, num),
    cannotDeclareRing: (match: any) => EffectBuilder.ring.static(EffectNames.CannotDeclareRing, match),
    considerRingAsClaimed: (match: any) => EffectBuilder.ring.static(EffectNames.ConsiderRingAsClaimed, match),
    // Player effects
    additionalAction: (amount: any = 1) => EffectBuilder.player.static(EffectNames.AdditionalAction, amount),
    additionalCardPlayed: (amount: any = 1) => EffectBuilder.player.flexible(EffectNames.AdditionalCardPlayed, amount),
    additionalCharactersInConflict: (amount: any) =>
        EffectBuilder.player.flexible(EffectNames.AdditionalCharactersInConflict, amount),
    additionalConflict: (type: any) => EffectBuilder.player.static(EffectNames.AdditionalConflict, type),
    additionalTriggerCost: (func: any) => EffectBuilder.player.static(EffectNames.AdditionalTriggerCost, func),
    additionalPlayCost: (func: any) => EffectBuilder.player.static(EffectNames.AdditionalPlayCost, func),
    alternateFatePool: (match: any) => EffectBuilder.player.static(EffectNames.AlternateFatePool, match),
    cannotDeclareConflictsOfType: (type: any) => EffectBuilder.player.static(EffectNames.CannotDeclareConflictsOfType, type),
    canPlayFromOwn,
    canPlayFromOpponents: (location: any, cards: any, sourceOfEffect: any, playType: any = PlayTypes.PlayFromHand) =>
        EffectBuilder.player.detached(EffectNames.CanPlayFromOpponents, {
            apply: (player: any) => {
                if(!player.opponent) {
                    return;
                }
                for(const card of cards.filter(
                    (card: any) => card.type === CardTypes.Event && card.location === location
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
    limitHonorGainPerPhase: (amount: any) => EffectBuilder.player.static(EffectNames.LimitHonorGainPerPhase, amount),
    modifyHonorTransferGiven: (amount: any) => EffectBuilder.player.static(EffectNames.ModifyHonorTransferGiven, amount),
    modifyHonorTransferReceived: (amount: any) =>
        EffectBuilder.player.static(EffectNames.ModifyHonorTransferReceived, amount),
    cannotResolveRings: () => EffectBuilder.player.static(EffectNames.CannotResolveRings, true),
    changePlayerGloryModifier,
    changePlayerSkillModifier: (value: any) => EffectBuilder.player.flexible(EffectNames.ChangePlayerSkillModifier, value),
    customDetachedPlayer: (properties: any) => EffectBuilder.player.detached(EffectNames.CustomEffect, properties),
    gainActionPhasePriority: () =>
        EffectBuilder.player.detached(EffectNames.GainActionPhasePriority, {
            apply: (player: any) => (player.actionPhasePriority = true),
            unapply: (player: any) => (player.actionPhasePriority = false)
        }),
    increaseCost: (properties: any) => Effects.reduceCost(Object.assign({}, properties, { amount: -properties.amount })),
    modifyCardsDrawnInDrawPhase: (amount: any) =>
        EffectBuilder.player.flexible(EffectNames.ModifyCardsDrawnInDrawPhase, amount),
    playerCannot: (properties: any) =>
        EffectBuilder.player.static(
            EffectNames.AbilityRestrictions,
            new Restriction(Object.assign({ type: properties.cannot || properties }, properties))
        ),
    playerDelayedEffect: (properties: any) => EffectBuilder.player.static(EffectNames.DelayedEffect, properties),
    playerFateCostToTargetCard: (properties: any) =>
        EffectBuilder.player.flexible(
            EffectNames.PlayerFateCostToTargetCard,
            properties
        ),
    reduceCost,
    reduceNextPlayedCardCost: (amount: any, match: any) =>
        EffectBuilder.player.detached(EffectNames.CostReducer, {
            apply: (player: any, context: any) =>
                player.addCostReducer(context.source, { amount: amount, match: match, limit: AbilityLimit.fixed(1) }),
            unapply: (player: any, context: any, reducer: any) => player.removeCostReducer(reducer)
        }),
    satisfyAffinity: (traits: any) => EffectBuilder.player.static(EffectNames.SatisfyAffinity, traits),
    setConflictDeclarationType: (type: any) => EffectBuilder.player.static(EffectNames.SetConflictDeclarationType, type),
    provideConflictDeclarationType: (type: any) =>
        EffectBuilder.player.static(EffectNames.ProvideConflictDeclarationType, type),
    forceConflictDeclarationType: (type: any) => EffectBuilder.player.static(EffectNames.ForceConflictDeclarationType, type),
    setMaxConflicts: (amount: any) => EffectBuilder.player.static(EffectNames.SetMaxConflicts, amount),
    setConflictTotalSkill: (value: any) => EffectBuilder.player.static(EffectNames.SetConflictTotalSkill, value),
    showTopConflictCard: (players: any = Players.Any) =>
        EffectBuilder.player.static(EffectNames.ShowTopConflictCard, players),
    showTopDynastyCard: () => EffectBuilder.player.static(EffectNames.ShowTopDynastyCard, true),
    eventsCannotBeCancelled: () => EffectBuilder.player.static(EffectNames.EventsCannotBeCancelled, true),
    mustDeclareMaximumAttackers: (type: any = 'both') =>
        EffectBuilder.player.static(EffectNames.MustDeclareMaximumAttackers, type),
    restartDynastyPhase: (source: any) => EffectBuilder.player.static(EffectNames.RestartDynastyPhase, source),
    strongholdCanBeAttacked: () => EffectBuilder.player.static(EffectNames.StrongholdCanBeAttacked, true),
    defendersChosenFirstDuringConflict: (amountOfAttackers: any) =>
        EffectBuilder.player.static(EffectNames.DefendersChosenFirstDuringConflict, amountOfAttackers),
    costToDeclareAnyParticipants: (properties: any) =>
        EffectBuilder.player.static(EffectNames.CostToDeclareAnyParticipants, properties),
    consideredLessHonorable: () => EffectBuilder.player.static(EffectNames.ConsideredLessHonorable, true),
    customFatePhaseFateRemoval: (refillFunc: any) =>
        EffectBuilder.player.static(EffectNames.CustomFatePhaseFateRemoval, refillFunc),
    changeConflictSkillFunctionPlayer: (func: any) =>
        EffectBuilder.player.static(EffectNames.ChangeConflictSkillFunction, func),
    limitLegalAttackers: (matchFunc: any) => EffectBuilder.player.static(EffectNames.LimitLegalAttackers, matchFunc),
    additionalActionAfterWindowCompleted: (amount: any = 1) =>
        EffectBuilder.player.static(EffectNames.AdditionalActionAfterWindowCompleted, amount),
    // Conflict effects
    charactersCannot: (properties: any) =>
        EffectBuilder.conflict.static(
            EffectNames.AbilityRestrictions,
            new Restriction(
                Object.assign({ restricts: 'characters', type: properties.cannot || properties }, properties)
            )
        ),
    cannotContribute: (func: any) => EffectBuilder.conflict.dynamic(EffectNames.CannotContribute, func),
    changeConflictSkillFunction: (func: any) => EffectBuilder.conflict.static(EffectNames.ChangeConflictSkillFunction, func),
    modifyConflictElementsToResolve: (value: any) =>
        EffectBuilder.conflict.static(EffectNames.ModifyConflictElementsToResolve, value),
    restrictNumberOfDefenders: (value: any) => EffectBuilder.conflict.static(EffectNames.RestrictNumberOfDefenders, value),
    resolveConflictEarly: () => EffectBuilder.player.static(EffectNames.ResolveConflictEarly, true),
    forceConflictUnopposed: () => EffectBuilder.conflict.static(EffectNames.ForceConflictUnopposed, true),
    modifyUnopposedHonorLoss: (amount: any = 1) =>
        EffectBuilder.conflict.static(EffectNames.ModifyUnopposedHonorLoss, amount),
    additionalAttackedProvince: (province: any) =>
        EffectBuilder.conflict.static(EffectNames.AdditionalAttackedProvince, province),
    conflictIgnoreStatusTokens: () => EffectBuilder.conflict.static(EffectNames.ConflictIgnoreStatusTokens, true),
    // Duel effects
    modifyDuelSkill: (properties: any) =>
        EffectBuilder.duel.flexible(
            EffectNames.ModifyDuelSkill,
            Object.assign({ player: properties.player, amount: properties.amount })
        ),
    applyStatusTokensToDuel: () => EffectBuilder.duel.static(EffectNames.ApplyStatusTokensToDuel, true),
    duelIgnorePrintedSkill: () => EffectBuilder.duel.static(EffectNames.DuelIgnorePrintedSkill, true)
};

export = Effects;
