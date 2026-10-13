import type { MessageArgs } from '../GameChat.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type { AbilityContext } from '../AbilityContext.js';
import { AddTokenAction, AddTokenProperties } from './AddTokenAction.js';
import { AffinityAction, AffinityProperties } from './AffinityAction.js';
import { AssignRolesAction, type AssignRolesProperties } from './AssignRolesAction.js';
import { AttachAction, AttachProperties } from './AttachAction.js';
import { RearrangeDeckAction, type RearrangeDeckProperties } from './RearrangeDeckAction.js';
import { AttachToRingAction, AttachToRingProperties } from './AttachToRingAction.js';
import { BowAction, BowProperties } from './BowAction.js';
import { BreakProvinceAction, BreakProperties } from './BreakProvinceAction.js';
import { CancelAction, CancelProperties, type CancellingContext } from './CancelAction.js';
import { CardMenuAction, CardMenuProperties } from './CardMenuAction.js';
import { ChooseActionProperties, ChooseGameAction } from './ChooseGameAction.js';
import { ChooseAmountAction, ChooseAmountProperties } from './ChooseAmountAction.js';
import { ChosenDiscardAction, ChosenDiscardProperties } from './ChosenDiscardAction.js';
import { ChosenReturnToDeckAction, ChosenReturnToDeckProperties } from './ChosenReturnToDeckAction.js';
import { ClaimImperialFavorAction, ClaimFavorProperties } from './ClaimImperialFavorAction.js';
import { ClaimRingAction, ClaimRingProperties } from './ClaimRingAction.js';
import { ConditionalAction, ConditionalProperties } from './ConditionalAction.js';
import { CreateTokenAction, CreateTokenProperties } from './CreateTokenAction.js';
import { DeckSearchAction, DeckSearchProperties } from './DeckSearchAction.js';
import { DetachAction, DetachProperties } from './DetachAction.js';
import { DiscardCardAction, DiscardCardProperties } from './DiscardCardAction.js';
import { LoseImperialFavorAction, DiscardFavorProperties } from './LoseImperialFavorAction.js';
import { DiscardFromPlayAction, DiscardFromPlayProperties } from './DiscardFromPlayAction.js';
import { DiscardStatusTokenAction, DiscardStatusProperties } from './DiscardStatusTokenAction.js';
import { DishonorAction, DishonorProperties } from './DishonorAction.js';
import { DishonorProvinceAction, DishonorProvinceProperties } from './DishonorProvinceAction.js';
import { DrawAction, DrawProperties } from './DrawAction.js';
import { DuelAction, DuelProperties } from './DuelAction.js';
import { DuelAddParticipantAction, DuelAddParticipantProperties } from './DuelAddParticipantAction.js';
import { FateBidAction, FateBidProperties } from './FateBidAction.js';
import { FillProvinceAction, FillProvinceProperties } from './FillProvinceAction.js';
import { FlipDynastyAction, FlipDynastyProperties } from './FlipDynastyAction.js';
import { FlipImperialFavorAction, FlipFavorProperties } from './FlipImperialFavorAction.js';
import { GainFateAction, GainFateProperties } from './GainFateAction.js';
import { GainHonorAction, GainHonorProperties } from './GainHonorAction.js';
import { GainStatusTokenAction, GainStatusTokenProperties } from './GainStatusTokenAction.js';
import { GameAction, type GameActionProperties, type GameActionTarget } from './GameAction.js';
import { CardType, Duration, Location, type EventName } from '../Constants.js';
import { delayedEffect } from '../effects.js';
import type { GameObject } from '../GameObject.js';
import { PerformGloryCountAction, GloryCountProperties } from './PerformGloryCountAction.js';
import { HandlerAction, HandlerProperties } from './HandlerAction.js';
import { HonorAction, HonorProperties } from './HonorAction.js';
import { HonorBidAction, HonorBidProperties } from './HonorBidAction.js';
import { IfAbleAction, IfAbleProperties } from './IfAbleAction.js';
import { InitiateConflictAction, InitiateConflictProperties } from './InitiateConflictAction.js';
import { InjureAction, InjureProperties } from './InjureAction.js';
import { JointGameAction } from './JointGameAction.js';
import { DuelLastingEffectAction, LastingEffectAction, PlayerLastingEffectAction, type LastingEffectProperties, type PlayerLastingEffectInput } from './LastingEffectAction.js';
import { CardLastingEffectAction, LastingEffectCardProperties } from './CardLastingEffectAction.js';
import { RingLastingEffectAction, LastingEffectRingProperties } from './RingLastingEffectAction.js';
import { LookAtAction, LookAtProperties } from './LookAtAction.js';
import { LoseFateAction, LoseFateProperties } from './LoseFateAction.js';
import { LoseHonorAction, LoseHonorProperties } from './LoseHonorAction.js';
import { OptionalAction, OptionalProperties } from './OptionalAction.js';
import { DiscardMatchingAction, MatchingDiscardProperties } from './DiscardMatchingAction.js';
import { ModifyBidAction, ModifyBidProperties } from './ModifyBidAction.js';
import { MoveCardAction, MoveCardProperties } from './MoveCardAction.js';
import { MoveConflictAction, MoveConflictProperties } from './MoveConflictAction.js';
import { MoveToConflictAction, MoveToConflictProperties } from './MoveToConflictAction.js';
import { MoveStatusTokenAction, MoveTokenProperties } from './MoveStatusTokenAction.js';
import { MultipleGameAction, type GameActionList } from './MultipleGameAction.js';
import { OpponentPutIntoPlayAction, OpponentPutIntoPlayProperties } from './OpponentPutIntoPlayAction.js';
import { PlaceCardUnderneathAction, PlaceCardUnderneathProperties } from './PlaceCardUnderneathAction.js';
import { PlaceFateAction, PlaceFateProperties } from './PlaceFateAction.js';
import { PlaceFateOnRingAction, PlaceFateRingProperties } from './PlaceFateOnRingAction.js';
import { PlayCardAction, PlayCardProperties } from './PlayCardAction.js';
import { PutIntoProvinceAction, PutInProvinceProperties } from './PutIntoProvinceAction.js';
import { PutIntoPlayAction, PutIntoPlayProperties } from './PutIntoPlayAction.js';
import { DiscardAtRandomAction, RandomDiscardProperties } from './DiscardAtRandomAction.js';
import { ReadyAction, ReadyProperties } from './ReadyAction.js';
import { RefillFaceupAction, RefillFaceupProperties } from './RefillFaceupAction.js';
import { RemoveFateAction, RemoveFateProperties } from './RemoveFateAction.js';
import { RemoveFromGameAction, RemoveFromGameProperties } from './RemoveFromGameAction.js';
import { RemoveRingFromPlayAction, RemoveRingFromPlayProperties } from './RemoveRingFromPlayAction.js';
import { ResolveAbilityAction, ResolveAbilityProperties } from './ResolveAbilityAction.js';
import { ResolveConflictRingAction } from './ResolveConflictRingAction.js';
import { ResolveRingEffectAction, ResolveElementProperties } from './ResolveRingEffectAction.js';
import { RestoreProvinceAction, RestoreProvinceProperties } from './RestoreProvinceAction.js';
import { ReturnRingAction, ReturnRingProperties } from './ReturnRingAction.js';
import { ReturnRingToPlayAction, ReturnRingToPlayProperties } from './ReturnRingToPlayAction.js';
import { ReturnToDeckAction, ReturnToDeckProperties } from './ReturnToDeckAction.js';
import { ReturnToHandAction, ReturnToHandProperties } from './ReturnToHandAction.js';
import { RevealAction, RevealProperties } from './RevealAction.js';
import { RingActionProperties } from './RingAction.js';
import { eraseSelectCardProperties, eraseSelectCardsProperties, SelectCardAction, type SelectCardProperties, type SelectCardsProperties } from './SelectCardAction.js';
import type { MultiCardMode } from '../CardSelector.js';
import type { CardTypes } from '../types/CardOfType.js';
import { SelectRingAction, SelectRingProperties } from './SelectRingActions.js';
import { SelectTokenAction, SelectTokenProperties } from './SelectTokenAction.js';
import { SendHomeAction, SendHomeProperties } from './SendHomeAction.js';
import { SequentialAction } from './SequentialAction.js';
import { SetHonorDialAction, SetDialProperties } from './SetHonorDialAction.js';
import { SetAsideAction, SetAsideProperties } from './SetAsideAction.js';
import { PlaceInProvinceAction, PlaceInProvinceProperties } from './PlaceInProvinceAction.js';
import { NameCardAction, NameCardProperties } from './NameCardAction.js';
import { TokenFromTopCardAction, TokenFromTopCardProperties } from './TokenFromTopCardAction.js';
import { ShuffleDeckAction, ShuffleDeckProperties } from './ShuffleDeckAction.js';
import { SwitchConflictElementAction, SwitchConflictElementProperties } from './SwitchConflictElementAction.js';
import { SwitchConflictTypeAction, SwitchConflictTypeProperties } from './SwitchConflictTypeAction.js';
import { TaintAction, TaintProperties } from './TaintAction.js';
import { TakeControlAction, TakeControlProperties } from './TakeControlAction.js';
import { TakeFateFromRingAction, TakeFateRingProperties } from './TakeFateFromRingAction.js';
import { TakeRingAction, TakeRingProperties } from './TakeRingAction.js';
import { TakeFateAction, TransferFateProperties } from './TakeFateAction.js';
import { TakeHonorAction, TransferHonorProperties } from './TakeHonorAction.js';
import { TriggerAbilityAction, TriggerAbilityProperties } from './TriggerAbilityAction.js';
import { TurnFacedownAction, TurnCardFacedownProperties } from './TurnFacedownAction.js';
import type { Derivable } from '../utils/helpers.js';

export function addToken<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<AddTokenProperties, C> = {}): AddTokenAction<C> {
    return new AddTokenAction<C>(propertyFactory);
}
export function attach<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<AttachProperties, C> = {}): AttachAction<C> {
    return new AttachAction<C>(propertyFactory);
}
export function attachToRing<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<AttachToRingProperties, C> = {}): AttachToRingAction<C> {
    return new AttachToRingAction<C>(propertyFactory);
}
export function bow<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<BowProperties, C> = {}): BowAction<C> {
    return new BowAction<C>(propertyFactory);
}
export function breakProvince<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<BreakProperties, C> = {}): BreakProvinceAction<C> {
    return new BreakProvinceAction<C>(propertyFactory);
}
export function cardLastingEffect<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<LastingEffectCardProperties<C>, C>): CardLastingEffectAction<C> {
    return new CardLastingEffectAction<C>(propertyFactory);
}
/** Resolves `gameAction` on the target cards (the source by default) when this conflict ends; `onlyIf` is checked then. */
export function atEndOfConflict<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<AtEndOfConflictProperties<C>, C>): CardLastingEffectAction<C> {
    return cardLastingEffect<C>((context) => {
        const { gameAction, message, onlyIf, ...rest } = typeof propertyFactory === 'function' ? propertyFactory(context) : propertyFactory;
        return {
            ...rest,
            duration: Duration.UntilEndOfPhase,
            effect: delayedEffect({
                when: { onConflictFinished: () => !onlyIf || onlyIf(context) },
                ...(message ? { message: (_context: AbilityContext, targets: GameObject[]) => message(context, targets) } : {}),
                gameAction
            })
        };
    });
}
export type AtEndOfConflictProperties<C extends AbilityContext = AbilityContext> = Omit<LastingEffectCardProperties<C>, 'duration' | 'until' | 'condition' | 'effect'> & {
    gameAction: GameAction;
    onlyIf?(context: C): boolean;
    message?(context: C, targets: GameObject[]): MessageArgs;
};
export function claimImperialFavor<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ClaimFavorProperties, C>): ClaimImperialFavorAction<C> {
    return new ClaimImperialFavorAction<C>(propertyFactory);
}
export function createToken<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<CreateTokenProperties, C>): CreateTokenAction<C> {
    return new CreateTokenAction<C>(propertyFactory);
}
export function detach<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DetachProperties, C> = {}): DetachAction<C> {
    return new DetachAction<C>(propertyFactory);
}
export function discardCard<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DiscardCardProperties, C> = {}): DiscardCardAction<C> {
    return new DiscardCardAction<C>(propertyFactory);
}
export function discardFromPlay<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DiscardFromPlayProperties, C> = {}): DiscardFromPlayAction<C> {
    return new DiscardFromPlayAction<C>(propertyFactory);
}
export function dishonor<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DishonorProperties, C> = {}): DishonorAction<C> {
    return new DishonorAction<C>(propertyFactory);
}
export function dishonorProvince<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DishonorProvinceProperties, C> = {}): DishonorProvinceAction<C> {
    return new DishonorProvinceAction<C>(propertyFactory);
}
export function duel<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DuelProperties<C>, C>): DuelAction<C> {
    return new DuelAction<C>(propertyFactory);
}
export function duelAddParticipant<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DuelAddParticipantProperties, C>): DuelAddParticipantAction<C> {
    return new DuelAddParticipantAction<C>(propertyFactory);
}
export function flipDynasty<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<FlipDynastyProperties, C> = {}): FlipDynastyAction<C> {
    return new FlipDynastyAction<C>(propertyFactory);
}
export function flipImperialFavor<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<FlipFavorProperties, C>): FlipImperialFavorAction<C> {
    return new FlipImperialFavorAction<C>(propertyFactory);
}
export function honor<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<HonorProperties, C> = {}): HonorAction<C> {
    return new HonorAction<C>(propertyFactory);
}
export function injure<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<InjureProperties, C> = {}): InjureAction<C> {
    return new InjureAction<C>(propertyFactory);
}

export function lookAt<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<LookAtProperties<C>, C> = {}): LookAtAction<C> {
    return new LookAtAction<C>(propertyFactory);
}
/**
 * default switch = false
 * default shuffle = false
 * default faceup = false
 */
export function moveCard<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<MoveCardProperties, C>): MoveCardAction<C> {
    return new MoveCardAction<C>(propertyFactory);
}
export function moveToConflict<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<MoveToConflictProperties, C> = {}): MoveToConflictAction<C> {
    return new MoveToConflictAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function placeFate<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PlaceFateProperties, C> = {}): PlaceFateAction<C> {
    return new PlaceFateAction<C>(propertyFactory);
}
/**
 * default resetOnCancel = false
 */
export function playCard<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PlayCardProperties, C> = {}): PlayCardAction<C> {
    return new PlayCardAction<C>(propertyFactory);
}
export function performGloryCount<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<GloryCountProperties, C>): PerformGloryCountAction<C> {
    return new PerformGloryCountAction<C>(propertyFactory);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function putIntoConflict<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PutIntoPlayProperties, C> = {}): PutIntoPlayAction<C> {
    return new PutIntoPlayAction<C>(propertyFactory);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function putIntoPlay<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PutIntoPlayProperties, C> = {}): PutIntoPlayAction<C> {
    return new PutIntoPlayAction<C>(propertyFactory, false);
}
export function putIntoProvince<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PutInProvinceProperties, C>): PutIntoProvinceAction<C> {
    return new PutIntoProvinceAction<C>(propertyFactory);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function opponentPutIntoPlay<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<OpponentPutIntoPlayProperties, C> = {}): OpponentPutIntoPlayAction<C> {
    return new OpponentPutIntoPlayAction<C>(propertyFactory, false);
}
export function ready<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ReadyProperties, C> = {}): ReadyAction<C> {
    return new ReadyAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function removeFate<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RemoveFateProperties, C> = {}): RemoveFateAction<C> {
    return new RemoveFateAction<C>(propertyFactory);
}
export function removeFromGame<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RemoveFromGameProperties, C> = {}): RemoveFromGameAction<C> {
    return new RemoveFromGameAction<C>(propertyFactory);
}
export function resolveAbility<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ResolveAbilityProperties, C>): ResolveAbilityAction<C> {
    return new ResolveAbilityAction<C>(propertyFactory);
}
export function restoreProvince<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RestoreProvinceProperties, C> = {}): RestoreProvinceAction<C> {
    return new RestoreProvinceAction<C>(propertyFactory);
}
/**
 * default bottom = false
 */
export function returnToDeck<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ReturnToDeckProperties, C> = {}): ReturnToDeckAction<C> {
    return new ReturnToDeckAction<C>(propertyFactory);
}
export function returnToHand<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ReturnToHandProperties, C> = {}): ReturnToHandAction<C> {
    return new ReturnToHandAction<C>(propertyFactory);
}
/**
 * default chatMessage = false
 */
export function reveal<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RevealProperties, C> = {}): RevealAction<C> {
    return new RevealAction<C>(propertyFactory);
}
export function sendHome<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<SendHomeProperties, C> = {}): SendHomeAction<C> {
    return new SendHomeAction<C>(propertyFactory);
}
export function sacrifice<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DiscardFromPlayProperties, C> = {}): DiscardFromPlayAction<C> {
    return new DiscardFromPlayAction<C>(propertyFactory, true);
}
export function taint<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TaintProperties, C> = {}): TaintAction<C> {
    return new TaintAction<C>(propertyFactory);
}
export function takeControl<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TakeControlProperties, C> = {}): TakeControlAction<C> {
    return new TakeControlAction<C>(propertyFactory);
}
export function triggerAbility<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TriggerAbilityProperties, C>): TriggerAbilityAction<C> {
    return new TriggerAbilityAction<C>(propertyFactory);
}
export function turnFacedown<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TurnCardFacedownProperties, C> = {}): TurnFacedownAction<C> {
    return new TurnFacedownAction<C>(propertyFactory);
}
export function gainStatusToken<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<GainStatusTokenProperties, C> = {}): GainStatusTokenAction<C> {
    return new GainStatusTokenAction<C>(propertyFactory);
}
export function moveConflict<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<MoveConflictProperties, C> = {}): MoveConflictAction<C> {
    return new MoveConflictAction<C>(propertyFactory);
}
/**
 * default hideWhenFaceup = true
 */
export function placeCardUnderneath<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PlaceCardUnderneathProperties, C>): PlaceCardUnderneathAction<C> {
    return new PlaceCardUnderneathAction<C>(propertyFactory);
}

/**
 * default amount = 1
 */
export function chosenDiscard<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ChosenDiscardProperties<C>, C> = {}): ChosenDiscardAction<C> {
    return new ChosenDiscardAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function chosenReturnToDeck<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ChosenReturnToDeckProperties, C> = {}): ChosenReturnToDeckAction<C> {
    return new ChosenReturnToDeckAction<C>(propertyFactory);
}
/**
 * default amount = -1 (whole deck)
 * default reveal = true
 * default cardCondition = always true
 */
export function deckSearch<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DeckSearchProperties<C>, C>): DeckSearchAction<C> {
    return new DeckSearchAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function discardAtRandom<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RandomDiscardProperties, C> = {}): DiscardAtRandomAction<C> {
    return new DiscardAtRandomAction<C>(propertyFactory);
}
/**
 * default amount = -1
 */
export function discardMatching<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<MatchingDiscardProperties<C>, C> = {}): DiscardMatchingAction<C> {
    return new DiscardMatchingAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function draw<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DrawProperties, C> = {}): DrawAction<C> {
    return new DrawAction<C>(propertyFactory);
}
/**
 * default fillTo = 1
 * default faceup = false
 */
export function fillProvince<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<FillProvinceProperties, C>): FillProvinceAction<C> {
    return new FillProvinceAction<C>(propertyFactory);
}
export function gainFate<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<GainFateProperties, C> = {}): GainFateAction<C> {
    return new GainFateAction<C>(propertyFactory);
} // amount = 1
export function gainHonor<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<GainHonorProperties, C> = {}): GainHonorAction<C> {
    return new GainHonorAction<C>(propertyFactory);
} // amount = 1
/**
 * default giveHonor = false
 * default players = Players.Any
 * default prohibitedBids = All bids allowed
 */
export function honorBid<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<HonorBidProperties<C>, C> = {}): HonorBidAction<C> {
    return new HonorBidAction<C>(propertyFactory);
}
export function fateBid<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<FateBidProperties<C>, C> = {}): FateBidAction<C> {
    return new FateBidAction<C>(propertyFactory);
}
export function initiateConflict<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<InitiateConflictProperties, C> = {}): InitiateConflictAction<C> {
    return new InitiateConflictAction<C>(propertyFactory);
} // canPass = true
export function loseFate<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<LoseFateProperties, C> = {}): LoseFateAction<C> {
    return new LoseFateAction<C>(propertyFactory);
}
export function loseHonor<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<LoseHonorProperties, C> = {}): LoseHonorAction<C> {
    return new LoseHonorAction<C>(propertyFactory);
} // amount = 1
export function loseImperialFavor<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DiscardFavorProperties, C> = {}): LoseImperialFavorAction<C> {
    return new LoseImperialFavorAction<C>(propertyFactory);
}
export function modifyBid<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ModifyBidProperties, C> = {}): ModifyBidAction<C> {
    return new ModifyBidAction<C>(propertyFactory);
} // amount = 1, direction = Direction.Increase
export function playerLastingEffect<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PlayerLastingEffectInput<C>, C>): PlayerLastingEffectAction<C> {
    return new PlayerLastingEffectAction<C>(propertyFactory);
} // target = the ability's player, duration = 'untilEndOfConflict', effect, condition, until
export function refillFaceup<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RefillFaceupProperties, C>): RefillFaceupAction<C> {
    return new RefillFaceupAction<C>(propertyFactory);
} // location
export function setHonorDial<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<SetDialProperties, C>): SetHonorDialAction<C> {
    return new SetHonorDialAction<C>(propertyFactory);
} // value
export function shuffleDeck<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ShuffleDeckProperties, C>): ShuffleDeckAction<C> {
    return new ShuffleDeckAction<C>(propertyFactory);
}
/** "Name a card": the chooser names a card, then `gameAction(cardName)` resolves. */
export function nameCard<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<NameCardProperties<C>, C>): NameCardAction<C> {
    return new NameCardAction<C>(propertyFactory);
}
/** The top card of a player's deck becomes a token, then `gameAction(token)` resolves. */
export function tokenFromTopCard<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TokenFromTopCardProperties, C>): TokenFromTopCardAction<C> {
    return new TokenFromTopCardAction<C>(propertyFactory);
}
/** Puts a dynasty card from out of play into a province, faceup by default, optionally discarding the cards there first. */
export function placeInProvince<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PlaceInProvinceProperties, C> = {}): PlaceInProvinceAction<C> {
    return new PlaceInProvinceAction<C>(propertyFactory);
}
/** Sets cards aside, out of play; optionally hidden, returned at the end of the conflict, or playable by a player. */
export function setAside<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<SetAsideProperties<C>, C> = {}): SetAsideAction<C> {
    return new SetAsideAction<C>(propertyFactory);
}
export function takeFate<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TransferFateProperties, C> = {}): TakeFateAction<C> {
    return new TakeFateAction<C>(propertyFactory);
} // amount = 1
export function takeHonor<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TransferHonorProperties, C> = {}): TakeHonorAction<C> {
    return new TakeHonorAction<C>(propertyFactory);
} // amount = 1

export function placeFateOnRing<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PlaceFateRingProperties, C> = {}): PlaceFateOnRingAction<C> {
    return new PlaceFateOnRingAction<C>(propertyFactory);
} // amount = 1, origin
export function resolveConflictRing<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RingActionProperties, C> = {}): ResolveConflictRingAction<C> {
    return new ResolveConflictRingAction<C>(propertyFactory);
}
export function resolveRingEffect<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ResolveElementProperties, C> = {}): ResolveRingEffectAction<C> {
    return new ResolveRingEffectAction<C>(propertyFactory);
}
export function returnRing<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ReturnRingProperties, C> = {}): ReturnRingAction<C> {
    return new ReturnRingAction<C>(propertyFactory);
}
export function ringLastingEffect<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<LastingEffectRingProperties<C>, C>): RingLastingEffectAction<C> {
    return new RingLastingEffectAction<C>(propertyFactory);
} // duration = 'untilEndOfConflict', effect, condition, until
export function selectRing<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<SelectRingProperties<C>, C>): SelectRingAction<C> {
    return new SelectRingAction<C>(propertyFactory);
}
export function switchConflictElement<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<SwitchConflictElementProperties, C> = {}): SwitchConflictElementAction<C> {
    return new SwitchConflictElementAction<C>(propertyFactory);
}
export function switchConflictType<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<SwitchConflictTypeProperties, C> = {}): SwitchConflictTypeAction<C> {
    return new SwitchConflictTypeAction<C>(propertyFactory);
}
export function takeFateFromRing<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TakeFateRingProperties, C> = {}): TakeFateFromRingAction<C> {
    return new TakeFateFromRingAction<C>(propertyFactory);
} // amount = 1
export function takeRing<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TakeRingProperties, C> = {}): TakeRingAction<C> {
    return new TakeRingAction<C>(propertyFactory);
}
export function claimRing<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ClaimRingProperties, C> = {}): ClaimRingAction<C> {
    return new ClaimRingAction<C>(propertyFactory);
}
export function removeRingFromPlay<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RemoveRingFromPlayProperties, C> = {}): RemoveRingFromPlayAction<C> {
    return new RemoveRingFromPlayAction<C>(propertyFactory);
}
export function returnRingToPlay<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ReturnRingToPlayProperties, C> = {}): ReturnRingToPlayAction<C> {
    return new ReturnRingToPlayAction<C>(propertyFactory);
}

export function discardStatusToken<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DiscardStatusProperties, C> = {}): DiscardStatusTokenAction<C> {
    return new DiscardStatusTokenAction<C>(propertyFactory);
}
export function moveStatusToken<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<MoveTokenProperties, C>): MoveStatusTokenAction<C> {
    return new MoveStatusTokenAction<C>(propertyFactory);
}

export function cancel<C extends CancellingContext = TriggeredAbilityContext>(propertyFactory: Derivable<CancelProperties, C> = {}): CancelAction<C> {
    return new CancelAction<C>(propertyFactory);
}
export function handler<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<HandlerProperties<C>, C> = {}): HandlerAction<C> {
    return new HandlerAction<C>(propertyFactory);
}
/** A chat line as a step of its own: a `msg` template, or nothing; `targets` as for `handler()`. */
export function chatMessage<C extends AbilityContext = AbilityContext>(message: (context: C, targets: GameActionTarget[]) => MessageArgs | undefined): HandlerAction<C> {
    return new HandlerAction<C>({
        handler: (context, targets) => {
            const line = message(context, targets);
            if(line) {
                context.game.addMessage(line);
            }
        }
    });
}
export { noAction } from './HandlerAction.js';

export function conflictLastingEffect<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<LastingEffectProperties<C>, C>): LastingEffectAction<C> {
    return new LastingEffectAction<C>(propertyFactory);
} // duration = 'untilEndOfConflict', effect, targetController, condition, until

export function duelLastingEffect<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<LastingEffectProperties<C>, C>): DuelLastingEffectAction<C> {
    return new DuelLastingEffectAction<C>(propertyFactory);
} // target = the current duel, duration = 'untilEndOfDuel', effect, condition, until

export function cardMenu<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<CardMenuProperties<C>, C>): CardMenuAction<C> {
    return new CardMenuAction<C>(propertyFactory);
}
export function chooseAction<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ChooseActionProperties<C>, C>): ChooseGameAction<C> {
    return new ChooseGameAction<C>(propertyFactory);
} // options, activePromptTitle = 'Select an action:'
export function chooseAmount<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ChooseAmountProperties<C>, C>): ChooseAmountAction<C> {
    return new ChooseAmountAction<C>(propertyFactory);
}
export function conditional<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ConditionalProperties<C>, C>): ConditionalAction<C> {
    return new ConditionalAction<C>(propertyFactory);
}
export function onAffinity<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<AffinityProperties<C>, C>): AffinityAction<C> {
    return new AffinityAction<C>(propertyFactory);
}
export function optional<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<OptionalProperties<C>, C>): OptionalAction<C> {
    return new OptionalAction<C>(propertyFactory);
}
export function ifAble<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<IfAbleProperties, C>): IfAbleAction<C> {
    return new IfAbleAction<C>(propertyFactory);
}
export function joint<C extends AbilityContext = AbilityContext>(gameActions: GameAction<GameActionProperties, EventName, C>[]): JointGameAction<C> {
    return new JointGameAction<C>(gameActions);
} // takes an array of gameActions, not a propertyFactory
export function multiple<C extends AbilityContext = AbilityContext>(gameActions: GameActionList<C>): MultipleGameAction<C> {
    return new MultipleGameAction<C>(gameActions);
} // a list of actions, or (context) => list
/** The player puts the top cards of a deck (by default their own) back in the order they choose. */
export function rearrangeDeck<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RearrangeDeckProperties<C>, C>): RearrangeDeckAction<C> {
    return new RearrangeDeckAction<C>(propertyFactory);
}
/** Two cards, two roles: the chooser gives each card one role, whose action then resolves on it. */
export function assignRoles<const R extends string, C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<AssignRolesProperties<R, C>, C>): AssignRolesAction<C> {
    return new AssignRolesAction<C>(propertyFactory);
}
export function selectCard<C extends AbilityContext = AbilityContext, const K extends CardTypes = CardTypes>(propertyFactory: Derivable<SelectCardProperties<C, K>, C>): SelectCardAction<C> {
    return new SelectCardAction<C>(typeof propertyFactory === 'function'
        ? (context) => eraseSelectCardProperties(propertyFactory(context))
        : eraseSelectCardProperties(propertyFactory));
}
/** "Choose an attacked province": a selectCard limited to the conflict's provinces, without a prompt when there is only one. */
export function selectAttackedProvince<C extends AbilityContext = AbilityContext>(
    propertyFactory: Derivable<AttackedProvinceProperties<C>, C>
): SelectCardAction<C> {
    const withDefaults = (properties: AttackedProvinceProperties<C>): SelectCardProperties<C, CardType.Province> => {
        const { cardCondition } = properties;
        return {
            activePromptTitle: 'Choose an attacked province',
            hidePromptIfSingleCard: true,
            ...properties,
            cardType: CardType.Province,
            location: Location.Provinces,
            cardCondition: (card, context) => card.isConflictProvince() && (!cardCondition || cardCondition(card, context))
        };
    };
    return selectCard<C, CardType.Province>(typeof propertyFactory === 'function'
        ? (context) => withDefaults(propertyFactory(context))
        : withDefaults(propertyFactory));
}
export type AttackedProvinceProperties<C extends AbilityContext = AbilityContext> = Omit<SelectCardProperties<C, CardType.Province>, 'cardType' | 'location'>;
/** Several cards; `mode` says how many. */
export function selectCards<C extends AbilityContext = AbilityContext, const K extends CardTypes = CardTypes>(propertyFactory: Derivable<SelectCardsProperties<C, K> & { mode: MultiCardMode }, C>): SelectCardAction<C> {
    return new SelectCardAction<C>(typeof propertyFactory === 'function'
        ? (context) => eraseSelectCardsProperties(propertyFactory(context))
        : eraseSelectCardsProperties(propertyFactory));
}
export function selectToken<C extends AbilityContext = AbilityContext>(propertyFactory: Derivable<SelectTokenProperties<C>, C>): SelectTokenAction<C> {
    return new SelectTokenAction<C>(propertyFactory);
}
export function sequential<C extends AbilityContext = AbilityContext>(gameActions: GameActionList<C>): SequentialAction<C> {
    return new SequentialAction<C>(gameActions);
} // a list of actions, or (context) => list

/** Each builder shortcut's properties, with its callbacks typed for the context `C` of the ability being built. */
export interface ActionProps<C extends AbilityContext> {
    addToken: AddTokenProperties;
    atEndOfConflict: AtEndOfConflictProperties<C>;
    attach: AttachProperties;
    bow: BowProperties;
    cancel: CancelProperties;
    cardLastingEffect: LastingEffectCardProperties<C>;
    cardMenu: CardMenuProperties<C>;
    chooseAction: ChooseActionProperties<C>;
    chooseAmount: ChooseAmountProperties<C>;
    chosenDiscard: ChosenDiscardProperties<C>;
    claimImperialFavor: ClaimFavorProperties;
    conflictLastingEffect: LastingEffectProperties<C>;
    deckSearch: DeckSearchProperties<C>;
    discardAtRandom: RandomDiscardProperties;
    discardCard: DiscardCardProperties;
    discardFromPlay: DiscardFromPlayProperties;
    dishonor: DishonorProperties;
    draw: DrawProperties;
    duelLastingEffect: LastingEffectProperties<C>;
    gainFate: GainFateProperties;
    gainHonor: GainHonorProperties;
    honor: HonorProperties;
    initiateConflict: InitiateConflictProperties;
    injure: InjureProperties;
    lookAt: LookAtProperties<C>;
    loseFate: LoseFateProperties;
    loseHonor: LoseHonorProperties;
    modifyBid: ModifyBidProperties;
    moveCard: MoveCardProperties;
    moveToConflict: MoveToConflictProperties;
    optional: OptionalProperties<C>;
    placeCardUnderneath: PlaceCardUnderneathProperties;
    placeFate: PlaceFateProperties;
    placeFateOnRing: PlaceFateRingProperties;
    playerLastingEffect: PlayerLastingEffectInput<C>;
    putIntoConflict: PutIntoPlayProperties;
    putIntoPlay: PutIntoPlayProperties;
    ready: ReadyProperties;
    refillFaceup: RefillFaceupProperties;
    removeFate: RemoveFateProperties;
    removeFromGame: RemoveFromGameProperties;
    resolveConflictRing: RingActionProperties;
    resolveRingEffect: ResolveElementProperties;
    returnToDeck: ReturnToDeckProperties;
    returnToHand: ReturnToHandProperties;
    ringLastingEffect: LastingEffectRingProperties<C>;
    sacrifice: DiscardFromPlayProperties;
    selectAttackedProvince: AttackedProvinceProperties<C>;
    selectRing: SelectRingProperties<C>;
    selectToken: SelectTokenProperties<C>;
    sendHome: SendHomeProperties;
    shuffleDeck: ShuffleDeckProperties;
    switchConflictType: SwitchConflictTypeProperties;
    taint: TaintProperties;
    takeFate: TransferFateProperties;
    takeHonor: TransferHonorProperties;
    tokenFromTopCard: TokenFromTopCardProperties;
}
