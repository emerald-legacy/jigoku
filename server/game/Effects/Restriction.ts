import { EffectValueBase } from './EffectValue.js';
import { AbilityType, CardType, Phase, type PlayType, RestrictionScope, RestrictionType, Stage, Trait, ALL_CARD_TYPES } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { BaseCardAbility } from '../BaseCardAbility.js';
import type Player from '../Player.js';

type RestrictionCheck = (context: AbilityContext, effect: Restriction, card?: BaseCard) => boolean;
/** A scope, or a trait the attempt's source has. */
type ScopeEntry = RestrictionScope | { trait: Trait };
export type RestrictionAppliesTo = ScopeEntry | ScopeEntry[];

const checkRestrictions: Record<RestrictionScope, RestrictionCheck> = {
    [RestrictionScope.AbilitiesTriggeredByOpponents]: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent &&
        context.ability.isTriggeredAbility() &&
        context.ability.abilityType !== AbilityType.ForcedReaction &&
        context.ability.abilityType !== AbilityType.ForcedInterrupt,
    [RestrictionScope.AdjacentCharacters]: (context, effect) =>
        context.source.type === CardType.Character &&
        context.player.areLocationsAdjacent(context.source.location, effect.requireContext().source.location),
    [RestrictionScope.AttachmentsWithSameClan]: (context, _effect, card) =>
        context.ability.isCardPlayed() &&
        isAttachment(context) &&
        context.source.getPrintedFaction() !== 'neutral' &&
        !!card && card.isFaction(context.source.getPrintedFaction()),
    [RestrictionScope.AttackedProvinceNonForced]: (context) =>
        !!context.game.currentConflict?.getConflictProvinces().some((province) => province === context.source) &&
        context.ability.isTriggeredAbility() &&
        context.ability.abilityType !== AbilityType.ForcedReaction &&
        context.ability.abilityType !== AbilityType.ForcedInterrupt,
    [RestrictionScope.CardEffects]: (context) => isCardEffect(context),
    [RestrictionScope.CardEffectsExceptOwn]: (context, effect) =>
        checkRestrictions[RestrictionScope.CardEffects](context, effect) && context.source !== effect.context?.source,
    [RestrictionScope.RingEffects]: (context) => context.source.isRing(),
    [RestrictionScope.CardAndRingEffects]: (context, effect) => checkRestrictions[RestrictionScope.CardEffects](context, effect) || checkRestrictions[RestrictionScope.RingEffects](context, effect),
    // a character played as an attachment is played as an attachment (EmeraldDB rulings on Grasp of Earth, Daimyō's Favor)
    [RestrictionScope.Characters]: (context) => context.source.type === CardType.Character && !context.ability.isCharacterPlayedAsAttachment(),
    [RestrictionScope.CharactersWithNoFate]: (context) => context.source.type === CardType.Character && context.source.getFate() === 0,
    [RestrictionScope.CopiesOfDiscardEvents]: (context) =>
        context.source.type === CardType.Event &&
        context.player.conflictDiscardPile.some((card: DrawCard) => card.name === context.source.name),
    [RestrictionScope.CopiesOfX]: (context, effect) => context.source.name === effect.params,
    [RestrictionScope.Events]: (context) => context.source.type === CardType.Event,
    [RestrictionScope.EventsWithSameClan]: (context, _effect, card) =>
        context.source.type === CardType.Event &&
        context.source.getPrintedFaction() !== 'neutral' &&
        !!card && card.isFaction(context.source.getPrintedFaction()),
    [RestrictionScope.NonDynastyPhase]: (context) => context.game.currentPhase !== Phase.Dynasty,
    [RestrictionScope.NonSpellEvents]: (context) => context.source.type === CardType.Event && !context.source.hasTrait(Trait.Spell),
    [RestrictionScope.OpponentsAttachments]: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent &&
        isAttachment(context),
    [RestrictionScope.OpponentsCardEffects]: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && isCardEffect(context),
    [RestrictionScope.OpponentsProvinceEffects]: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && isCardEffect(context) && context.source.type === CardType.Province,
    [RestrictionScope.OpponentsEvents]: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent &&
        context.source.type === CardType.Event,
    [RestrictionScope.OpponentsRingEffects]: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && context.source.isRing(),
    [RestrictionScope.OpponentsCardAndRingEffects]: (context, effect) =>
        checkRestrictions[RestrictionScope.OpponentsCardEffects](context, effect) ||
        checkRestrictions[RestrictionScope.OpponentsRingEffects](context, effect),
    [RestrictionScope.OpponentsTriggeredAbilities]: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && context.ability.isTriggeredAbility(),
    [RestrictionScope.OpponentsTriggeredActionAbilities]: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && context.ability.isTriggeredAbility() &&
        context.ability.abilityType === AbilityType.Action,
    [RestrictionScope.OwnCardEffects]: (context, effect) =>
        context.player === getApplyingPlayer(effect) && isCardEffect(context),
    [RestrictionScope.AllButOwnCardEffects]: (context, effect) =>
        !checkRestrictions[RestrictionScope.OwnCardEffects](context, effect),
    [RestrictionScope.OpponentsCardAbilities]: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && context.ability.isCardAbility(),
    [RestrictionScope.OpponentsCharacters]: (context, effect) =>
        context.source.type === CardType.Character && context.source.controller === getApplyingPlayer(effect).opponent,
    [RestrictionScope.OpponentsCharacterAbilitiesWithLowerGlory]: (context, effect) => {
        const parent = effect.requireContext().source.parentCharacter;
        return context.source.type === CardType.Character &&
            context.source.controller === getApplyingPlayer(effect).opponent &&
            !!parent && context.source.isDrawCard() && context.source.glory < parent.glory;
    },
    [RestrictionScope.Reactions]: (context) => context.ability.abilityType === AbilityType.Reaction,
    [RestrictionScope.ActionEvents]: (context) =>
        context.ability instanceof BaseCardAbility &&
        context.ability.card.type === CardType.Event && context.ability.abilityType === AbilityType.Action,
    [RestrictionScope.Source]: (context, effect) => context.source === effect.context?.source,
    [RestrictionScope.ThisAbility]: (context, effect) => context.ability === effect.context?.ability,
    [RestrictionScope.KeywordAbilities]: (context) => context.ability.isKeywordAbility(),
    [RestrictionScope.NonKeywordAbilities]: (context) => !context.ability.isKeywordAbility(),
    [RestrictionScope.NonForcedAbilities]: (context) =>
        context.ability.isTriggeredAbility() &&
        context.ability.abilityType !== AbilityType.ForcedReaction &&
        context.ability.abilityType !== AbilityType.ForcedInterrupt,
    [RestrictionScope.EqualOrMoreExpensiveCharacterTriggeredAbilities]: (context, _effect, card) =>
        context.source.type === CardType.Character &&
        !context.ability.isKeywordAbility() &&
        !!card && card.isDrawCard() && context.source.isDrawCard() && context.source.costAtLeast(card.getCost()),
    [RestrictionScope.EqualOrMoreExpensiveCharacterKeywords]: (context, _effect, card) =>
        context.source.type === CardType.Character &&
        context.ability.isKeywordAbility() &&
        !!card && card.isDrawCard() && context.source.isDrawCard() && context.source.costAtLeast(card.getCost()),
    [RestrictionScope.EventPlayedByHigherBidPlayer]: (context, _effect, card) =>
        context.source.type === CardType.Event && !!card && context.player.showBid > card.controller.showBid,
    [RestrictionScope.LoseHonorAsCost]: (context) => context.stage === Stage.Cost,
    [RestrictionScope.UnlessMeishodo]: (context) =>
        !!context.source && context.source.hasTrait(Trait.Spell) && !context.source.hasTrait(Trait.Meishodo)
};

/** Whether `context` is a card effect: a card's ability resolving, not a cost and not playing a card (RRG "Card effect"). */
export const isCardEffect = (context: AbilityContext) =>
    (context.ability.isCardAbility() || !context.ability.isCardPlayed()) &&
    context.stage !== Stage.Cost &&
    ALL_CARD_TYPES.some((type) => type === context.source.type);

const getApplyingPlayer = (effect: Restriction): Player => {
    return effect.applyingPlayer || effect.requireContext().player;
};

/** An attachment, or a character played as an attachment (Tattooed Wanderer, Jealous Ancestor). */
const isAttachment = (context: AbilityContext) => context.source.type === CardType.Attachment || !!context.ability.isCharacterPlayedAsAttachment();

/** What an immunity (a restriction naming no type) doesn't stop (RRG Immune): peripheral entities such as fate and attachments aren't immune. */
const immunityExemptTypes = new Set<RestrictionType | PlayType | undefined>([RestrictionType.RemoveFate, RestrictionType.Attach]);

const leavePlayTypes = new Set<RestrictionType | PlayType | undefined>([
    RestrictionType.DiscardFromPlay,
    RestrictionType.Sacrifice,
    RestrictionType.ReturnToHand,
    RestrictionType.ReturnToDeck,
    RestrictionType.RemoveFromGame,
    RestrictionType.PutIntoProvince
]);

export interface RestrictionProperties {
    cannot?: RestrictionType | PlayType;
    appliesTo?: RestrictionAppliesTo;
    applyingPlayer?: Player;
    /** The card name `RestrictionScope.CopiesOfX` compares with. */
    params?: string;
}

export class Restriction extends EffectValueBase<Restriction> {
    type?: RestrictionType | PlayType;
    /** Which attempts it applies to; all of them without one. */
    appliesTo?: RestrictionAppliesTo;
    applyingPlayer?: Player;
    params?: string;

    constructor(properties: RestrictionType | PlayType | RestrictionProperties) {
        super();
        if(typeof properties === 'string') {
            this.type = properties;
        } else {
            this.type = properties.cannot;
            this.appliesTo = properties.appliesTo;
            this.applyingPlayer = properties.applyingPlayer;
            this.params = properties.params;
        }
    }

    getValue() {
        return this;
    }

    /** `type` undefined: only a restriction that names no type matches. */
    isMatch(type: RestrictionType | PlayType | undefined, context: AbilityContext, card?: BaseCard): boolean {
        if(this.type === RestrictionType.LeavePlay) {
            return leavePlayTypes.has(type) && this.checkCondition(context, card);
        }

        if(!this.type) {
            // an immunity doesn't stop a card from being used to pay costs (RRG Immune)
            return context?.stage !== Stage.Cost && !immunityExemptTypes.has(type) && this.checkCondition(context, card);
        }
        return this.type === type && this.checkCondition(context, card);
    }

    checkCondition(context: AbilityContext, card?: BaseCard): boolean {
        if(!this.appliesTo) {
            return true;
        }
        if(!context) {
            throw new Error('checkCondition called without a context');
        }
        return [this.appliesTo].flat().every((entry) => this.applies(entry, context, card));
    }

    private applies(entry: ScopeEntry, context: AbilityContext, card?: BaseCard): boolean {
        return typeof entry === 'object' ? context.source.hasTrait(entry.trait) : checkRestrictions[entry](context, this, card);
    }
}

