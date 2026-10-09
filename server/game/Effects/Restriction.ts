import { EffectValueBase } from './EffectValue.js';
import { AbilityType, CardType, Location, Phase, type PlayType, RestrictionScope, RestrictionType, Stage } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { BaseCardAbility } from '../BaseCardAbility.js';
import { ThenAbility } from '../ThenAbility.js';
import { MoveCardAction } from '../GameActions/MoveCardAction.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type Player from '../Player.js';

type RestrictionCheck = (context: AbilityContext, effect: Restriction, card?: BaseCard) => boolean;
/** A scope, or a trait the attempt's source has. */
type ScopeEntry = RestrictionScope | { trait: string };
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
        context.source.type === CardType.Attachment &&
        context.source.getPrintedFaction() !== 'neutral' &&
        !!card && card.isFaction(context.source.getPrintedFaction()),
    [RestrictionScope.AttackedProvinceNonForced]: (context) =>
        !!context.game.currentConflict?.getConflictProvinces().some((province) => province === context.source) &&
        context.ability.isTriggeredAbility() &&
        context.ability.abilityType !== AbilityType.ForcedReaction &&
        context.ability.abilityType !== AbilityType.ForcedInterrupt,
    [RestrictionScope.CardEffects]: (context) =>
        (context.ability.isCardAbility() || !context.ability.isCardPlayed()) &&
        context.stage !== Stage.Cost &&
        [
            CardType.Event,
            CardType.Character,
            CardType.Holding,
            CardType.Attachment,
            CardType.Stronghold,
            CardType.Province,
            CardType.Role
        ].includes(context.source.type),
    [RestrictionScope.RingEffects]: (context) => context.source.isRing(),
    [RestrictionScope.CardAndRingEffects]: (context, effect) => checkRestrictions[RestrictionScope.CardEffects](context, effect) || checkRestrictions[RestrictionScope.RingEffects](context, effect),
    [RestrictionScope.Characters]: (context) => context.source.type === CardType.Character,
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
    [RestrictionScope.NonSpellEvents]: (context) => context.source.type === CardType.Event && !context.source.hasTrait('spell'),
    [RestrictionScope.OpponentsAttachments]: (context, effect) =>
        context.player &&
        context.player === getApplyingPlayer(effect).opponent &&
        context.source.type === CardType.Attachment,
    [RestrictionScope.OpponentsCardEffects]: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent &&
        (context.ability.isCardAbility() || !context.ability.isCardPlayed()) &&
        [
            CardType.Event,
            CardType.Character,
            CardType.Holding,
            CardType.Attachment,
            CardType.Stronghold,
            CardType.Province,
            CardType.Role
        ].includes(context.source.type),
    [RestrictionScope.OpponentsProvinceEffects]: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent &&
        (context.ability.isCardAbility() || !context.ability.isCardPlayed()) &&
        [CardType.Province].includes(context.source.type),
    [RestrictionScope.OpponentsEvents]: (context, effect) =>
        context.player &&
        context.player === getApplyingPlayer(effect).opponent &&
        context.source.type === CardType.Event,
    [RestrictionScope.OpponentsRingEffects]: (context, effect) =>
        context.player && context.player === getApplyingPlayer(effect).opponent && context.source.isRing(),
    [RestrictionScope.OpponentsCardAndRingEffects]: (context, effect) =>
        checkRestrictions[RestrictionScope.OpponentsCardEffects](context, effect) ||
        checkRestrictions[RestrictionScope.OpponentsRingEffects](context, effect),
    [RestrictionScope.OpponentsTriggeredAbilities]: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && context.ability.isTriggeredAbility(),
    [RestrictionScope.OpponentsTriggeredActionAbilities]: (context, effect) =>
        context.player === getApplyingPlayer(effect).opponent && context.ability.isTriggeredAbility() &&
        context.ability.abilityType === AbilityType.Action,
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
    [RestrictionScope.KeywordAbilities]: (context) => context.ability.isKeywordAbility(),
    [RestrictionScope.NonKeywordAbilities]: (context) => !context.ability.isKeywordAbility(),
    [RestrictionScope.NonForcedAbilities]: (context) =>
        context.ability.isTriggeredAbility() &&
        context.ability.abilityType !== AbilityType.ForcedReaction &&
        context.ability.abilityType !== AbilityType.ForcedInterrupt,
    [RestrictionScope.EqualOrMoreExpensiveCharacterTriggeredAbilities]: (context, _effect, card) =>
        context.source.type === CardType.Character &&
        !context.ability.isKeywordAbility() &&
        !!card && printedCostOf(context.source) >= printedCostOf(card),
    [RestrictionScope.EqualOrMoreExpensiveCharacterKeywords]: (context, _effect, card) =>
        context.source.type === CardType.Character &&
        context.ability.isKeywordAbility() &&
        !!card && printedCostOf(context.source) >= printedCostOf(card),
    [RestrictionScope.EventPlayedByHigherBidPlayer]: (context, _effect, card) =>
        context.source.type === CardType.Event && !!card && context.player.showBid > card.controller.showBid,
    [RestrictionScope.ToHand]: (context) => {
        if(!(context.ability instanceof ThenAbility)) {
            return false;
        }
        const properties = context.ability.properties;
        const targetActions: GameAction[] = properties.target?.gameAction
            ? (Array.isArray(properties.target.gameAction) ? properties.target.gameAction : [properties.target.gameAction])
            : [];
        const nestedActions = context.ability.gameAction
            ? context.ability.gameAction.map((topAction: GameAction) =>
                topAction.properties && 'gameAction' in topAction.properties ? topAction.properties.gameAction : undefined
            )
            : [];

        return targetActions.some(isMoveToHandAction) || nestedActions.some(isMoveToHandAction);
    },
    [RestrictionScope.LoseHonorAsCost]: (context) => context.stage === Stage.Cost,
    [RestrictionScope.UnlessMeishodo]: (context) =>
        !!context.source && context.source.hasTrait('spell') && !context.source.hasTrait('meishodo')
};

const getApplyingPlayer = (effect: Restriction): Player => {
    return effect.applyingPlayer || effect.requireContext().player;
};

// a move action built from a property factory has no stored properties
const isMoveToHandAction = (gameAction: unknown) =>
    gameAction instanceof MoveCardAction && gameAction.properties?.destination === Location.Hand;

const printedCostOf = (card: BaseCard) => (card.isDrawCard() ? card.printedCost ?? 0 : 0);

const leavePlayTypes = new Set<RestrictionType | PlayType | undefined>([
    RestrictionType.DiscardFromPlay,
    RestrictionType.Sacrifice,
    RestrictionType.ReturnToHand,
    RestrictionType.ReturnToDeck,
    RestrictionType.RemoveFromGame
]);

export interface RestrictionProperties {
    type?: RestrictionType | PlayType;
    appliesTo?: RestrictionAppliesTo;
    applyingPlayer?: Player;
    params?: unknown;
    cannot?: RestrictionType | PlayType;
}

export class Restriction extends EffectValueBase<Restriction> {
    type?: RestrictionType | PlayType;
    /** Which attempts it applies to; all of them without one. */
    appliesTo?: RestrictionAppliesTo;
    applyingPlayer?: Player;
    params: unknown;

    constructor(properties: RestrictionType | PlayType | RestrictionProperties) {
        super();
        if(typeof properties === 'string') {
            this.type = properties;
        } else {
            this.type = properties.type;
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

        return (!this.type || this.type === type) && this.checkCondition(context, card);
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

