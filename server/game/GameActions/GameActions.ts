import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type { AbilityContext } from '../AbilityContext.js';
import { AddTokenAction, AddTokenProperties } from './AddTokenAction.js';
import { AffinityAction, AffinityActionProperties } from './AffinityAction.js';
import { AttachAction, AttachActionProperties } from './AttachAction.js';
import { AttachToRingAction, AttachToRingActionProperties } from './AttachToRingAction.js';
import { BowAction, BowActionProperties } from './BowAction.js';
import { BreakAction, BreakProperties } from './BreakAction.js';
import { CancelAction, CancelActionProperties, type CancellingContext } from './CancelAction.js';
import { CardMenuAction, CardMenuProperties } from './CardMenuAction.js';
import { ChooseActionProperties, ChooseGameAction } from './ChooseGameAction.js';
import { ChosenDiscardAction, ChosenDiscardProperties } from './ChosenDiscardAction.js';
import { ChosenReturnToDeckAction, ChosenReturnToDeckProperties } from './ChosenReturnToDeckAction.js';
import { ClaimFavorAction, ClaimFavorProperties } from './ClaimFavorAction.js';
import { ClaimRingAction, ClaimRingProperties } from './ClaimRingAction.js';
import { ConditionalAction, ConditionalActionProperties } from './ConditionalAction.js';
import { CreateTokenAction, CreateTokenProperties } from './CreateTokenAction.js';
import { DeckSearchAction, DeckSearchProperties } from './DeckSearchAction.js';
import { DetachAction, DetachActionProperties } from './DetachAction.js';
import { DiscardCardAction, DiscardCardProperties } from './DiscardCardAction.js';
import { DiscardFavorAction, DiscardFavorProperties } from './DiscardFavorAction.js';
import { DiscardFromPlayAction, DiscardFromPlayProperties } from './DiscardFromPlayAction.js';
import { DiscardStatusAction, DiscardStatusProperties } from './DiscardStatusAction.js';
import { DishonorAction, DishonorProperties } from './DishonorAction.js';
import { DishonorProvinceAction, DishonorProvinceProperties } from './DishonorProvinceAction.js';
import { DrawAction, DrawProperties } from './DrawAction.js';
import { DuelAction, DuelProperties } from './DuelAction.js';
import { DuelAddParticipantAction, DuelAddParticipantProperties } from './DuelAddParticipantAction.js';
import { FateBidAction, FateBidProperties } from './FateBidAction.js';
import { FillProvinceAction, FillProvinceProperties } from './FillProvinceAction.js';
import { FlipDynastyAction, FlipDynastyProperties } from './FlipDynastyAction.js';
import { FlipFavorAction, FlipFavorProperties } from './FlipFavorAction.js';
import { GainFateAction, GainFateProperties } from './GainFateAction.js';
import { GainHonorAction, GainHonorProperties } from './GainHonorAction.js';
import { GainStatusTokenAction, GainStatusTokenProperties } from './GainStatusTokenAction.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { EventName } from '../Constants.js';
import { GloryCountAction, GloryCountProperties } from './GloryCountAction.js';
import { HandlerAction, HandlerProperties } from './HandlerAction.js';
import { HonorAction, HonorProperties } from './HonorAction.js';
import { HonorBidAction, HonorBidProperties } from './HonorBidAction.js';
import { IfAbleAction, IfAbleActionProperties } from './IfAbleAction.js';
import { InitiateConflictAction, InitiateConflictProperties } from './InitiateConflictAction.js';
import { InjureAction, InjureActionProperties } from './InjureAction.js';
import { JointGameAction } from './JointGameAction.js';
import { LastingEffectAction, LastingEffectProperties } from './LastingEffectAction.js';
import { LastingEffectCardAction, LastingEffectCardProperties } from './LastingEffectCardAction.js';
import { LastingEffectRingAction, LastingEffectRingProperties } from './LastingEffectRingAction.js';
import { LookAtAction, LookAtProperties } from './LookAtAction.js';
import { LoseFateAction, LoseFateProperties } from './LoseFateAction.js';
import { LoseHonorAction, LoseHonorProperties } from './LoseHonorAction.js';
import { OptionalAction, OptionalActionProperties } from './OptionalAction.js';
import { MatchingDiscardAction, MatchingDiscardProperties } from './MatchingDiscardAction.js';
import { MenuPromptAction, MenuPromptProperties } from './MenuPromptAction.js';
import { ModifyBidAction, ModifyBidProperties } from './ModifyBidAction.js';
import { MoveCardAction, MoveCardProperties } from './MoveCardAction.js';
import { MoveConflictAction, MoveConflictProperties } from './MoveConflictAction.js';
import { MoveToConflictAction, MoveToConflictProperties } from './MoveToConflictAction.js';
import { MoveTokenAction, MoveTokenProperties } from './MoveTokenAction.js';
import { MultipleContextActionProperties, MultipleContextGameAction } from './MultipleContextGameAction.js';
import { MultipleGameAction } from './MultipleGameAction.js';
import { OpponentPutIntoPlayAction, OpponentPutIntoPlayProperties } from './OpponentPutIntoPlayAction.js';
import { PlaceCardUnderneathAction, PlaceCardUnderneathProperties } from './PlaceCardUnderneathAction.js';
import { PlaceFateAction, PlaceFateProperties } from './PlaceFateAction.js';
import { PlaceFateRingAction, PlaceFateRingProperties } from './PlaceFateRingAction.js';
import { PlayCardAction, PlayCardProperties } from './PlayCardAction.js';
import { PutInProvinceAction, PutInProvinceProperties } from './PutInProvinceAction.js';
import { PutIntoPlayAction, PutIntoPlayProperties } from './PutIntoPlayAction.js';
import { RandomDiscardAction, RandomDiscardProperties } from './RandomDiscardAction.js';
import { ReadyAction, ReadyProperties } from './ReadyAction.js';
import { RefillFaceupAction, RefillFaceupProperties } from './RefillFaceupAction.js';
import { RemoveFateAction, RemoveFateProperties } from './RemoveFateAction.js';
import { RemoveFromGameAction, RemoveFromGameProperties } from './RemoveFromGameAction.js';
import { RemoveRingFromPlayAction, RemoveRingFromPlayProperties } from './RemoveRingFromPlayAction.js';
import { ResolveAbilityAction, ResolveAbilityProperties } from './ResolveAbilityAction.js';
import { ResolveConflictRingAction } from './ResolveConflictRingAction.js';
import { ResolveElementAction, ResolveElementProperties } from './ResolveElementAction.js';
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
import { SequentialContextAction, SequentialContextProperties } from './SequentialContextAction.js';
import { SetDialAction, SetDialProperties } from './SetDialAction.js';
import { ShuffleDeckAction, ShuffleDeckProperties } from './ShuffleDeckAction.js';
import { SwitchConflictElementAction, SwitchConflictElementProperties } from './SwitchConflictElementAction.js';
import { SwitchConflictTypeAction, SwitchConflictTypeProperties } from './SwitchConflictTypeAction.js';
import { TaintAction, TaintProperties } from './TaintAction.js';
import { TakeControlAction, TakeControlProperties } from './TakeControlAction.js';
import { TakeFateRingAction, TakeFateRingProperties } from './TakeFateRingAction.js';
import { TakeRingAction, TakeRingProperties } from './TakeRingAction.js';
import { TransferFateAction, TransferFateProperties } from './TransferFateAction.js';
import { TransferHonorAction, TransferHonorProperties } from './TransferHonorAction.js';
import { TriggerAbilityAction, TriggerAbilityProperties } from './TriggerAbilityAction.js';
import { TurnCardFacedownAction, TurnCardFacedownProperties } from './TurnCardFacedownAction.js';

type PropsFactory<Props, C extends AbilityContext = AbilityContext> =
    Props | ((context: C) => Props);

//////////////
// CARD
//////////////
export function addToken<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<AddTokenProperties, C> = {}): AddTokenAction<C> {
    return new AddTokenAction<C>(propertyFactory);
}
export function attach<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<AttachActionProperties, C> = {}): AttachAction<C> {
    return new AttachAction<C>(propertyFactory);
}
export function attachToRing<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<AttachToRingActionProperties, C> = {}): AttachToRingAction<C> {
    return new AttachToRingAction<C>(propertyFactory);
}
export function bow<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<BowActionProperties, C> = {}): BowAction<C> {
    return new BowAction<C>(propertyFactory);
}
export function breakProvince<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<BreakProperties, C> = {}): BreakAction<C> {
    return new BreakAction<C>(propertyFactory);
}
export function cardLastingEffect<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LastingEffectCardProperties, C>): LastingEffectCardAction<C> {
    return new LastingEffectCardAction<C>(propertyFactory);
}
export function claimImperialFavor<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ClaimFavorProperties, C>): ClaimFavorAction<C> {
    return new ClaimFavorAction<C>(propertyFactory);
}
export function createToken<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<CreateTokenProperties, C>): CreateTokenAction<C> {
    return new CreateTokenAction<C>(propertyFactory);
}
export function detach<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DetachActionProperties, C> = {}): DetachAction<C> {
    return new DetachAction<C>(propertyFactory);
}
export function discardCard<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DiscardCardProperties, C> = {}): DiscardCardAction<C> {
    return new DiscardCardAction<C>(propertyFactory);
}
export function discardFromPlay<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DiscardFromPlayProperties, C> = {}): DiscardFromPlayAction<C> {
    return new DiscardFromPlayAction<C>(propertyFactory);
}
export function dishonor<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DishonorProperties, C> = {}): DishonorAction<C> {
    return new DishonorAction<C>(propertyFactory);
}
export function dishonorProvince<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DishonorProvinceProperties, C> = {}): DishonorProvinceAction<C> {
    return new DishonorProvinceAction<C>(propertyFactory);
}
export function duel<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DuelProperties, C>): DuelAction<C> {
    return new DuelAction<C>(propertyFactory);
}
export function duelAddParticipant<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DuelAddParticipantProperties, C>): DuelAddParticipantAction<C> {
    return new DuelAddParticipantAction<C>(propertyFactory);
}
export function flipDynasty<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<FlipDynastyProperties, C> = {}): FlipDynastyAction<C> {
    return new FlipDynastyAction<C>(propertyFactory);
}
export function flipImperialFavor<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<FlipFavorProperties, C>): FlipFavorAction<C> {
    return new FlipFavorAction<C>(propertyFactory);
}
export function honor<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<HonorProperties, C> = {}): HonorAction<C> {
    return new HonorAction<C>(propertyFactory);
}
export function injure<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<InjureActionProperties, C> = {}): InjureAction<C> {
    return new InjureAction<C>(propertyFactory);
}

export function lookAt<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LookAtProperties, C> = {}): LookAtAction<C> {
    return new LookAtAction<C>(propertyFactory);
}
/**
 * default switch = false
 * default shuffle = false
 * default faceup = false
 */
export function moveCard<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<MoveCardProperties, C>): MoveCardAction<C> {
    return new MoveCardAction<C>(propertyFactory);
}
export function moveToConflict<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<MoveToConflictProperties, C> = {}): MoveToConflictAction<C> {
    return new MoveToConflictAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function placeFate<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PlaceFateProperties, C> = {}): PlaceFateAction<C> {
    return new PlaceFateAction<C>(propertyFactory);
}
/**
 * default resetOnCancel = false
 */
export function playCard<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PlayCardProperties, C> = {}): PlayCardAction<C> {
    return new PlayCardAction<C>(propertyFactory);
}
export function performGloryCount<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<GloryCountProperties, C>): GloryCountAction<C> {
    return new GloryCountAction<C>(propertyFactory);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function putIntoConflict<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PutIntoPlayProperties, C> = {}): PutIntoPlayAction<C> {
    return new PutIntoPlayAction<C>(propertyFactory);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function putIntoPlay<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PutIntoPlayProperties, C> = {}): PutIntoPlayAction<C> {
    return new PutIntoPlayAction<C>(propertyFactory, false);
}
export function putIntoProvince<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PutInProvinceProperties, C>): PutInProvinceAction<C> {
    return new PutInProvinceAction<C>(propertyFactory);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function opponentPutIntoPlay<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<OpponentPutIntoPlayProperties, C> = {}): OpponentPutIntoPlayAction<C> {
    return new OpponentPutIntoPlayAction<C>(propertyFactory, false);
}
export function ready<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ReadyProperties, C> = {}): ReadyAction<C> {
    return new ReadyAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function removeFate<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RemoveFateProperties, C> = {}): RemoveFateAction<C> {
    return new RemoveFateAction<C>(propertyFactory);
}
export function removeFromGame<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RemoveFromGameProperties, C> = {}): RemoveFromGameAction<C> {
    return new RemoveFromGameAction<C>(propertyFactory);
}
export function resolveAbility<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ResolveAbilityProperties, C>): ResolveAbilityAction<C> {
    return new ResolveAbilityAction<C>(propertyFactory);
}
export function restoreProvince<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RestoreProvinceProperties, C> = {}): RestoreProvinceAction<C> {
    return new RestoreProvinceAction<C>(propertyFactory);
}
/**
 * default bottom = false
 */
export function returnToDeck<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ReturnToDeckProperties, C> = {}): ReturnToDeckAction<C> {
    return new ReturnToDeckAction<C>(propertyFactory);
}
export function returnToHand<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ReturnToHandProperties, C> = {}): ReturnToHandAction<C> {
    return new ReturnToHandAction<C>(propertyFactory);
}
/**
 * default chatMessage = false
 */
export function reveal<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RevealProperties, C> = {}): RevealAction<C> {
    return new RevealAction<C>(propertyFactory);
}
export function sendHome<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SendHomeProperties, C> = {}): SendHomeAction<C> {
    return new SendHomeAction<C>(propertyFactory);
}
export function sacrifice<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DiscardFromPlayProperties, C> = {}): DiscardFromPlayAction<C> {
    return new DiscardFromPlayAction<C>(propertyFactory, true);
}
export function taint<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TaintProperties, C> = {}): TaintAction<C> {
    return new TaintAction<C>(propertyFactory);
}
export function takeControl<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TakeControlProperties, C> = {}): TakeControlAction<C> {
    return new TakeControlAction<C>(propertyFactory);
}
export function triggerAbility<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TriggerAbilityProperties, C>): TriggerAbilityAction<C> {
    return new TriggerAbilityAction<C>(propertyFactory);
}
export function turnFacedown<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TurnCardFacedownProperties, C> = {}): TurnCardFacedownAction<C> {
    return new TurnCardFacedownAction<C>(propertyFactory);
}
export function gainStatusToken<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<GainStatusTokenProperties, C> = {}): GainStatusTokenAction<C> {
    return new GainStatusTokenAction<C>(propertyFactory);
}
export function moveConflict<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<MoveConflictProperties, C> = {}): MoveConflictAction<C> {
    return new MoveConflictAction<C>(propertyFactory);
}
/**
 * default hideWhenFaceup = true
 */
export function placeCardUnderneath<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PlaceCardUnderneathProperties, C>): PlaceCardUnderneathAction<C> {
    return new PlaceCardUnderneathAction<C>(propertyFactory);
}

//////////////
// PLAYER
//////////////
/**
 * default amount = 1
 */
export function chosenDiscard<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ChosenDiscardProperties, C> = {}): ChosenDiscardAction<C> {
    return new ChosenDiscardAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function chosenReturnToDeck<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ChosenReturnToDeckProperties, C> = {}): ChosenReturnToDeckAction<C> {
    return new ChosenReturnToDeckAction<C>(propertyFactory);
}
/**
 * default amount = -1 (whole deck)
 * default reveal = true
 * default cardCondition = always true
 */
export function deckSearch<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DeckSearchProperties, C>): DeckSearchAction<C> {
    return new DeckSearchAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function discardAtRandom<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RandomDiscardProperties, C> = {}): RandomDiscardAction<C> {
    return new RandomDiscardAction<C>(propertyFactory);
}
/**
 * default amount = -1
 */
export function discardMatching<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<MatchingDiscardProperties, C> = {}): MatchingDiscardAction<C> {
    return new MatchingDiscardAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function draw<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DrawProperties, C> = {}): DrawAction<C> {
    return new DrawAction<C>(propertyFactory);
}
/**
 * default fillTo = 1
 * default faceup = false
 */
export function fillProvince<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<FillProvinceProperties, C>): FillProvinceAction<C> {
    return new FillProvinceAction<C>(propertyFactory);
}
export function gainFate<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<GainFateProperties, C> = {}): GainFateAction<C> {
    return new GainFateAction<C>(propertyFactory);
} // amount = 1
export function gainHonor<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<GainHonorProperties, C> = {}): GainHonorAction<C> {
    return new GainHonorAction<C>(propertyFactory);
} // amount = 1
/**
 * default giveHonor = false
 * default players = Players.Any
 * default prohibitedBids = All bids allowed
 */
export function honorBid<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<HonorBidProperties, C> = {}): HonorBidAction<C> {
    return new HonorBidAction<C>(propertyFactory);
}
export function fateBid<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<FateBidProperties, C> = {}): FateBidAction<C> {
    return new FateBidAction<C>(propertyFactory);
}
export function initiateConflict<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<InitiateConflictProperties, C> = {}): InitiateConflictAction<C> {
    return new InitiateConflictAction<C>(propertyFactory);
} // canPass = true
export function loseFate<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LoseFateProperties, C> = {}): LoseFateAction<C> {
    return new LoseFateAction<C>(propertyFactory);
}
export function loseHonor<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LoseHonorProperties, C> = {}): LoseHonorAction<C> {
    return new LoseHonorAction<C>(propertyFactory);
} // amount = 1
export function loseImperialFavor<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DiscardFavorProperties, C> = {}): DiscardFavorAction<C> {
    return new DiscardFavorAction<C>(propertyFactory);
}
export function modifyBid<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ModifyBidProperties, C> = {}): ModifyBidAction<C> {
    return new ModifyBidAction<C>(propertyFactory);
} // amount = 1, direction = Direction.Increase
export function playerLastingEffect<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LastingEffectProperties, C>): LastingEffectAction<C> {
    return new LastingEffectAction<C>(propertyFactory);
} // duration = 'untilEndOfConflict', effect, targetController, condition, until
export function refillFaceup<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RefillFaceupProperties, C>): RefillFaceupAction<C> {
    return new RefillFaceupAction<C>(propertyFactory);
} // location
export function setHonorDial<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SetDialProperties, C>): SetDialAction<C> {
    return new SetDialAction<C>(propertyFactory);
} // value
export function shuffleDeck<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ShuffleDeckProperties, C>): ShuffleDeckAction<C> {
    return new ShuffleDeckAction<C>(propertyFactory);
}
export function takeFate<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TransferFateProperties, C> = {}): TransferFateAction<C> {
    return new TransferFateAction<C>(propertyFactory);
} // amount = 1
export function takeHonor<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TransferHonorProperties, C> = {}): TransferHonorAction<C> {
    return new TransferHonorAction<C>(propertyFactory);
} // amount = 1

//////////////
// RING
//////////////
export function placeFateOnRing<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PlaceFateRingProperties, C> = {}): PlaceFateRingAction<C> {
    return new PlaceFateRingAction<C>(propertyFactory);
} // amount = 1, origin
export function resolveConflictRing<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RingActionProperties, C> = {}): ResolveConflictRingAction<C> {
    return new ResolveConflictRingAction<C>(propertyFactory);
}
export function resolveRingEffect<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ResolveElementProperties, C> = {}): ResolveElementAction<C> {
    return new ResolveElementAction<C>(propertyFactory);
}
export function returnRing<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ReturnRingProperties, C> = {}): ReturnRingAction<C> {
    return new ReturnRingAction<C>(propertyFactory);
}
export function ringLastingEffect<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LastingEffectRingProperties, C>): LastingEffectRingAction<C> {
    return new LastingEffectRingAction<C>(propertyFactory);
} // duration = 'untilEndOfConflict', effect, condition, until
export function selectRing<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SelectRingProperties, C>): SelectRingAction<C> {
    return new SelectRingAction<C>(propertyFactory);
}
export function switchConflictElement<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SwitchConflictElementProperties, C> = {}): SwitchConflictElementAction<C> {
    return new SwitchConflictElementAction<C>(propertyFactory);
}
export function switchConflictType<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SwitchConflictTypeProperties, C> = {}): SwitchConflictTypeAction<C> {
    return new SwitchConflictTypeAction<C>(propertyFactory);
}
export function takeFateFromRing<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TakeFateRingProperties, C> = {}): TakeFateRingAction<C> {
    return new TakeFateRingAction<C>(propertyFactory);
} // amount = 1
export function takeRing<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TakeRingProperties, C> = {}): TakeRingAction<C> {
    return new TakeRingAction<C>(propertyFactory);
}
export function claimRing<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ClaimRingProperties, C> = {}): ClaimRingAction<C> {
    return new ClaimRingAction<C>(propertyFactory);
}
export function removeRingFromPlay<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RemoveRingFromPlayProperties, C> = {}): RemoveRingFromPlayAction<C> {
    return new RemoveRingFromPlayAction<C>(propertyFactory);
}
export function returnRingToPlay<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ReturnRingToPlayProperties, C> = {}): ReturnRingToPlayAction<C> {
    return new ReturnRingToPlayAction<C>(propertyFactory);
}

//////////////
// STATUS TOKEN
//////////////
export function discardStatusToken<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DiscardStatusProperties, C> = {}): DiscardStatusAction<C> {
    return new DiscardStatusAction<C>(propertyFactory);
}
export function moveStatusToken<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<MoveTokenProperties, C>): MoveTokenAction<C> {
    return new MoveTokenAction<C>(propertyFactory);
}

//////////////
// GENERIC
//////////////
export function cancel<C extends CancellingContext = TriggeredAbilityContext>(propertyFactory: PropsFactory<CancelActionProperties, C> = {}): CancelAction<C> {
    return new CancelAction<C>(propertyFactory);
}
export function handler<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<HandlerProperties<C>, C> = {}): HandlerAction<C> {
    return new HandlerAction<C>(propertyFactory);
}
export function noAction(): GameAction {
    const action = new HandlerAction({});
    action.isNoAction = true;
    return action;
}

//////////////
// CONFLICT
//////////////
export function conflictLastingEffect<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LastingEffectProperties, C>): LastingEffectAction<C> {
    return new LastingEffectAction<C>(propertyFactory);
} // duration = 'untilEndOfConflict', effect, targetController, condition, until

//////////////
// DUEL
//////////////
export function duelLastingEffect<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LastingEffectProperties, C>): LastingEffectAction<C> {
    return new LastingEffectAction<C>(propertyFactory);
} // duration = 'untilEndOfConflict', effect, targetController, condition, until

//////////////
// META
//////////////
export function cardMenu<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<CardMenuProperties, C>): CardMenuAction<C> {
    return new CardMenuAction<C>(propertyFactory);
}
export function chooseAction<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ChooseActionProperties, C>): ChooseGameAction<C> {
    return new ChooseGameAction<C>(propertyFactory);
} // options, activePromptTitle = 'Select an action:'
export function conditional<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ConditionalActionProperties<C>, C>): ConditionalAction<C> {
    return new ConditionalAction<C>(propertyFactory);
}
export function onAffinity<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<AffinityActionProperties, C>): AffinityAction<C> {
    return new AffinityAction<C>(propertyFactory);
}
export function optional<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<OptionalActionProperties, C>): OptionalAction<C> {
    return new OptionalAction<C>(propertyFactory);
}
export function ifAble<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<IfAbleActionProperties, C>): IfAbleAction<C> {
    return new IfAbleAction<C>(propertyFactory);
}
export function joint<C extends AbilityContext = AbilityContext>(gameActions: GameAction<GameActionProperties, EventName, C>[]): JointGameAction<C> {
    return new JointGameAction<C>(gameActions);
} // takes an array of gameActions, not a propertyFactory
export function multiple<C extends AbilityContext = AbilityContext>(gameActions: GameAction<GameActionProperties, EventName, C>[]): MultipleGameAction<C> {
    return new MultipleGameAction<C>(gameActions);
} // takes an array of gameActions, not a propertyFactory
export function multipleContext<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<MultipleContextActionProperties, C>): MultipleContextGameAction<C> {
    return new MultipleContextGameAction<C>(propertyFactory);
}
export function menuPrompt<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<MenuPromptProperties, C>): MenuPromptAction<C> {
    return new MenuPromptAction<C>(propertyFactory);
}
export function selectCard<C extends AbilityContext = AbilityContext, const K extends CardTypes = CardTypes>(propertyFactory: PropsFactory<SelectCardProperties<C, K>, C>): SelectCardAction<C> {
    return new SelectCardAction<C>(typeof propertyFactory === 'function'
        ? (context) => eraseSelectCardProperties(propertyFactory(context))
        : eraseSelectCardProperties(propertyFactory));
}
/** Several cards; `mode` says how many. */
export function selectCards<C extends AbilityContext = AbilityContext, const K extends CardTypes = CardTypes>(propertyFactory: PropsFactory<SelectCardsProperties<C, K> & { mode: MultiCardMode }, C>): SelectCardAction<C> {
    return new SelectCardAction<C>(typeof propertyFactory === 'function'
        ? (context) => eraseSelectCardsProperties(propertyFactory(context))
        : eraseSelectCardsProperties(propertyFactory));
}
export function selectToken<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SelectTokenProperties, C>): SelectTokenAction<C> {
    return new SelectTokenAction<C>(propertyFactory);
}
export function sequential<C extends AbilityContext = AbilityContext>(gameActions: GameAction<GameActionProperties, EventName, C>[]): SequentialAction<C> {
    return new SequentialAction<C>(gameActions);
} // takes an array of gameActions, not a propertyFactory
export function sequentialContext<C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SequentialContextProperties, C>): SequentialContextAction<C> {
    return new SequentialContextAction<C>(propertyFactory);
}
