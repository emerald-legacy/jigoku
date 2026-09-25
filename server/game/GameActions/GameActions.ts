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
import { JointGameContextProperties, JointGameContextAction } from './JointGameContextAction.js';
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
import { PlaceFateAttachmentAction, PlaceFateAttachmentProperties } from './PlaceFateAttachmentAction.js';
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
import { SelectCardAction, SelectCardProperties } from './SelectCardAction.js';
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

// C is inferred from an annotated callback (`(context: AbilityContext<DrawCard, DrawCard>) => ...`);
// an explicit `<Target>` type argument stops that inference, so drop it when annotating.
type PropsFactory<Props, _Target = unknown, C extends AbilityContext = AbilityContext> =
    Props | ((context: C) => Props);

//////////////
// CARD
//////////////
export function addToken<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<AddTokenProperties, NoInfer<Target>, C> = {}): AddTokenAction<C> {
    return new AddTokenAction<C>(propertyFactory);
}
export function attach<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<AttachActionProperties, NoInfer<Target>, C> = {}): AttachAction<C> {
    return new AttachAction<C>(propertyFactory);
}
export function attachToRing<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<AttachToRingActionProperties, NoInfer<Target>, C> = {}): AttachToRingAction<C> {
    return new AttachToRingAction<C>(propertyFactory);
}
export function bow<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<BowActionProperties, NoInfer<Target>, C> = {}): BowAction<C> {
    return new BowAction<C>(propertyFactory);
}
export function breakProvince<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<BreakProperties, NoInfer<Target>, C> = {}): BreakAction<C> {
    return new BreakAction<C>(propertyFactory);
}
export function cardLastingEffect<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LastingEffectCardProperties, NoInfer<Target>, C>): LastingEffectCardAction<C> {
    return new LastingEffectCardAction<C>(propertyFactory);
}
export function claimImperialFavor<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ClaimFavorProperties, NoInfer<Target>, C>): ClaimFavorAction<C> {
    return new ClaimFavorAction<C>(propertyFactory);
}
export function createToken<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<CreateTokenProperties, NoInfer<Target>, C>): CreateTokenAction<C> {
    return new CreateTokenAction<C>(propertyFactory);
}
export function detach<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DetachActionProperties, NoInfer<Target>, C> = {}): DetachAction<C> {
    return new DetachAction<C>(propertyFactory);
}
export function discardCard<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DiscardCardProperties, NoInfer<Target>, C> = {}): DiscardCardAction<C> {
    return new DiscardCardAction<C>(propertyFactory);
}
export function discardFromPlay<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DiscardFromPlayProperties, NoInfer<Target>, C> = {}): DiscardFromPlayAction<C> {
    return new DiscardFromPlayAction<C>(propertyFactory);
}
export function dishonor<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DishonorProperties, NoInfer<Target>, C> = {}): DishonorAction<C> {
    return new DishonorAction<C>(propertyFactory);
}
export function dishonorProvince<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DishonorProvinceProperties, NoInfer<Target>, C> = {}): DishonorProvinceAction<C> {
    return new DishonorProvinceAction<C>(propertyFactory);
}
export function duel<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DuelProperties, NoInfer<Target>, C>): DuelAction<C> {
    return new DuelAction<C>(propertyFactory);
}
export function duelAddParticipant<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DuelAddParticipantProperties, NoInfer<Target>, C>): DuelAddParticipantAction<C> {
    return new DuelAddParticipantAction<C>(propertyFactory);
}
export function flipDynasty<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<FlipDynastyProperties, NoInfer<Target>, C> = {}): FlipDynastyAction<C> {
    return new FlipDynastyAction<C>(propertyFactory);
}
export function flipImperialFavor<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<FlipFavorProperties, NoInfer<Target>, C>): FlipFavorAction<C> {
    return new FlipFavorAction<C>(propertyFactory);
}
export function honor<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<HonorProperties, NoInfer<Target>, C> = {}): HonorAction<C> {
    return new HonorAction<C>(propertyFactory);
}
export function injure<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<InjureActionProperties, NoInfer<Target>, C> = {}): InjureAction<C> {
    return new InjureAction<C>(propertyFactory);
}

export function lookAt<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LookAtProperties, NoInfer<Target>, C> = {}): LookAtAction<C> {
    return new LookAtAction<C>(propertyFactory);
}
/**
 * default switch = false
 * default shuffle = false
 * default faceup = false
 */
export function moveCard<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<MoveCardProperties, NoInfer<Target>, C>): MoveCardAction<C> {
    return new MoveCardAction<C>(propertyFactory);
}
export function moveToConflict<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<MoveToConflictProperties, NoInfer<Target>, C> = {}): MoveToConflictAction<C> {
    return new MoveToConflictAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function placeFate<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PlaceFateProperties, NoInfer<Target>, C> = {}): PlaceFateAction<C> {
    return new PlaceFateAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function placeFateAttachment<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PlaceFateAttachmentProperties, NoInfer<Target>, C> = {}): PlaceFateAttachmentAction<C> {
    return new PlaceFateAttachmentAction<C>(propertyFactory);
}
/**
 * default resetOnCancel = false
 */
export function playCard<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PlayCardProperties, NoInfer<Target>, C> = {}): PlayCardAction<C> {
    return new PlayCardAction<C>(propertyFactory);
}
export function performGloryCount<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<GloryCountProperties, NoInfer<Target>, C>): GloryCountAction<C> {
    return new GloryCountAction<C>(propertyFactory);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function putIntoConflict<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PutIntoPlayProperties, NoInfer<Target>, C> = {}): PutIntoPlayAction<C> {
    return new PutIntoPlayAction<C>(propertyFactory);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function putIntoPlay<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PutIntoPlayProperties, NoInfer<Target>, C> = {}): PutIntoPlayAction<C> {
    return new PutIntoPlayAction<C>(propertyFactory, false);
}
export function putIntoProvince<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PutInProvinceProperties, NoInfer<Target>, C>): PutInProvinceAction<C> {
    return new PutInProvinceAction<C>(propertyFactory);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function opponentPutIntoPlay<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<OpponentPutIntoPlayProperties, NoInfer<Target>, C> = {}): OpponentPutIntoPlayAction<C> {
    return new OpponentPutIntoPlayAction<C>(propertyFactory, false);
}
export function ready<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ReadyProperties, NoInfer<Target>, C> = {}): ReadyAction<C> {
    return new ReadyAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function removeFate<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RemoveFateProperties, NoInfer<Target>, C> = {}): RemoveFateAction<C> {
    return new RemoveFateAction<C>(propertyFactory);
}
export function removeFromGame<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RemoveFromGameProperties, NoInfer<Target>, C> = {}): RemoveFromGameAction<C> {
    return new RemoveFromGameAction<C>(propertyFactory);
}
export function resolveAbility<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ResolveAbilityProperties, NoInfer<Target>, C>): ResolveAbilityAction<C> {
    return new ResolveAbilityAction<C>(propertyFactory);
}
export function restoreProvince<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RestoreProvinceProperties, NoInfer<Target>, C> = {}): RestoreProvinceAction<C> {
    return new RestoreProvinceAction<C>(propertyFactory);
}
/**
 * default bottom = false
 */
export function returnToDeck<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ReturnToDeckProperties, NoInfer<Target>, C> = {}): ReturnToDeckAction<C> {
    return new ReturnToDeckAction<C>(propertyFactory);
}
export function returnToHand<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ReturnToHandProperties, NoInfer<Target>, C> = {}): ReturnToHandAction<C> {
    return new ReturnToHandAction<C>(propertyFactory);
}
/**
 * default chatMessage = false
 */
export function reveal<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RevealProperties, NoInfer<Target>, C> = {}): RevealAction<C> {
    return new RevealAction<C>(propertyFactory);
}
export function sendHome<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SendHomeProperties, NoInfer<Target>, C> = {}): SendHomeAction<C> {
    return new SendHomeAction<C>(propertyFactory);
}
export function sacrifice<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DiscardFromPlayProperties, NoInfer<Target>, C> = {}): DiscardFromPlayAction<C> {
    return new DiscardFromPlayAction<C>(propertyFactory, true);
}
export function taint<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TaintProperties, NoInfer<Target>, C> = {}): TaintAction<C> {
    return new TaintAction<C>(propertyFactory);
}
export function takeControl<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TakeControlProperties, NoInfer<Target>, C> = {}): TakeControlAction<C> {
    return new TakeControlAction<C>(propertyFactory);
}
export function triggerAbility<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TriggerAbilityProperties, NoInfer<Target>, C>): TriggerAbilityAction<C> {
    return new TriggerAbilityAction<C>(propertyFactory);
}
export function turnFacedown<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TurnCardFacedownProperties, NoInfer<Target>, C> = {}): TurnCardFacedownAction<C> {
    return new TurnCardFacedownAction<C>(propertyFactory);
}
export function gainStatusToken<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<GainStatusTokenProperties, NoInfer<Target>, C> = {}): GainStatusTokenAction<C> {
    return new GainStatusTokenAction<C>(propertyFactory);
}
export function moveConflict<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<MoveConflictProperties, NoInfer<Target>, C> = {}): MoveConflictAction<C> {
    return new MoveConflictAction<C>(propertyFactory);
}
/**
 * default hideWhenFaceup = true
 */
export function placeCardUnderneath<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PlaceCardUnderneathProperties, NoInfer<Target>, C>): PlaceCardUnderneathAction<C> {
    return new PlaceCardUnderneathAction<C>(propertyFactory);
}

//////////////
// PLAYER
//////////////
/**
 * default amount = 1
 */
export function chosenDiscard<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ChosenDiscardProperties, NoInfer<Target>, C> = {}): ChosenDiscardAction<C> {
    return new ChosenDiscardAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function chosenReturnToDeck<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ChosenReturnToDeckProperties, NoInfer<Target>, C> = {}): ChosenReturnToDeckAction<C> {
    return new ChosenReturnToDeckAction<C>(propertyFactory);
}
/**
 * default amount = -1 (whole deck)
 * default reveal = true
 * default cardCondition = always true
 */
export function deckSearch<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DeckSearchProperties, NoInfer<Target>, C>): DeckSearchAction<C> {
    return new DeckSearchAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function discardAtRandom<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RandomDiscardProperties, NoInfer<Target>, C> = {}): RandomDiscardAction<C> {
    return new RandomDiscardAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function discardMatching<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<MatchingDiscardProperties, NoInfer<Target>, C> = {}): MatchingDiscardAction<C> {
    return new MatchingDiscardAction<C>(propertyFactory);
}
/**
 * default amount = 1
 */
export function draw<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DrawProperties, NoInfer<Target>, C> = {}): DrawAction<C> {
    return new DrawAction<C>(propertyFactory);
}
/**
 * default amount = 1
 * default faceup = false
 */
export function fillProvince<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<FillProvinceProperties, NoInfer<Target>, C>): FillProvinceAction<C> {
    return new FillProvinceAction<C>(propertyFactory);
}
export function gainFate<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<GainFateProperties, NoInfer<Target>, C> = {}): GainFateAction<C> {
    return new GainFateAction<C>(propertyFactory);
} // amount = 1
export function gainHonor<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<GainHonorProperties, NoInfer<Target>, C> = {}): GainHonorAction<C> {
    return new GainHonorAction<C>(propertyFactory);
} // amount = 1
/**
 * default giveHonor = false
 * default players = Players.Any
 * default prohibitedBids = All bids allowed
 */
export function honorBid<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<HonorBidProperties, NoInfer<Target>, C> = {}): HonorBidAction<C> {
    return new HonorBidAction<C>(propertyFactory);
}
export function fateBid<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<FateBidProperties, NoInfer<Target>, C> = {}): FateBidAction<C> {
    return new FateBidAction<C>(propertyFactory);
}
export function initiateConflict<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<InitiateConflictProperties, NoInfer<Target>, C> = {}): InitiateConflictAction<C> {
    return new InitiateConflictAction<C>(propertyFactory);
} // canPass = true
export function loseFate<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LoseFateProperties, NoInfer<Target>, C> = {}): LoseFateAction<C> {
    return new LoseFateAction<C>(propertyFactory);
}
export function loseHonor<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LoseHonorProperties, NoInfer<Target>, C> = {}): LoseHonorAction<C> {
    return new LoseHonorAction<C>(propertyFactory);
} // amount = 1
export function loseImperialFavor<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DiscardFavorProperties, NoInfer<Target>, C> = {}): DiscardFavorAction<C> {
    return new DiscardFavorAction<C>(propertyFactory);
}
export function modifyBid<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ModifyBidProperties, NoInfer<Target>, C> = {}): ModifyBidAction<C> {
    return new ModifyBidAction<C>(propertyFactory);
} // amount = 1, direction = 'increast', promptPlayer = false
export function playerLastingEffect<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LastingEffectProperties, NoInfer<Target>, C>): LastingEffectAction<C> {
    return new LastingEffectAction<C>(propertyFactory);
} // duration = 'untilEndOfConflict', effect, targetController, condition, until
export function refillFaceup<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RefillFaceupProperties, NoInfer<Target>, C>): RefillFaceupAction<C> {
    return new RefillFaceupAction<C>(propertyFactory);
} // location
export function setHonorDial<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SetDialProperties, NoInfer<Target>, C>): SetDialAction<C> {
    return new SetDialAction<C>(propertyFactory);
} // value
export function shuffleDeck<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ShuffleDeckProperties, NoInfer<Target>, C>): ShuffleDeckAction<C> {
    return new ShuffleDeckAction<C>(propertyFactory);
}
export function takeFate<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TransferFateProperties, NoInfer<Target>, C> = {}): TransferFateAction<C> {
    return new TransferFateAction<C>(propertyFactory);
} // amount = 1
export function takeHonor<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TransferHonorProperties, NoInfer<Target>, C> = {}): TransferHonorAction<C> {
    return new TransferHonorAction<C>(propertyFactory);
} // amount = 1

//////////////
// RING
//////////////
export function placeFateOnRing<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<PlaceFateRingProperties, NoInfer<Target>, C> = {}): PlaceFateRingAction<C> {
    return new PlaceFateRingAction<C>(propertyFactory);
} // amount = 1, origin
export function resolveConflictRing<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RingActionProperties, NoInfer<Target>, C> = {}): ResolveConflictRingAction<C> {
    return new ResolveConflictRingAction<C>(propertyFactory);
} // resolveAsAttacker = true
export function resolveRingEffect<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ResolveElementProperties, NoInfer<Target>, C> = {}): ResolveElementAction<C> {
    return new ResolveElementAction<C>(propertyFactory);
} // options = false
export function returnRing<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ReturnRingProperties, NoInfer<Target>, C> = {}): ReturnRingAction<C> {
    return new ReturnRingAction<C>(propertyFactory);
}
export function ringLastingEffect<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LastingEffectRingProperties, NoInfer<Target>, C>): LastingEffectRingAction<C> {
    return new LastingEffectRingAction<C>(propertyFactory);
} // duration = 'untilEndOfConflict', effect, condition, until
export function selectRing<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SelectRingProperties, NoInfer<Target>, C>): SelectRingAction<C> {
    return new SelectRingAction<C>(propertyFactory);
}
export function switchConflictElement<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SwitchConflictElementProperties, NoInfer<Target>, C> = {}): SwitchConflictElementAction<C> {
    return new SwitchConflictElementAction<C>(propertyFactory);
}
export function switchConflictType<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SwitchConflictTypeProperties, NoInfer<Target>, C> = {}): SwitchConflictTypeAction<C> {
    return new SwitchConflictTypeAction<C>(propertyFactory);
}
export function takeFateFromRing<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TakeFateRingProperties, NoInfer<Target>, C> = {}): TakeFateRingAction<C> {
    return new TakeFateRingAction<C>(propertyFactory);
} // amount = 1
export function takeRing<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<TakeRingProperties, NoInfer<Target>, C> = {}): TakeRingAction<C> {
    return new TakeRingAction<C>(propertyFactory);
}
export function claimRing<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ClaimRingProperties, NoInfer<Target>, C> = {}): ClaimRingAction<C> {
    return new ClaimRingAction<C>(propertyFactory);
}
export function removeRingFromPlay<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<RemoveRingFromPlayProperties, NoInfer<Target>, C> = {}): RemoveRingFromPlayAction<C> {
    return new RemoveRingFromPlayAction<C>(propertyFactory);
}
export function returnRingToPlay<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ReturnRingToPlayProperties, NoInfer<Target>, C> = {}): ReturnRingToPlayAction<C> {
    return new ReturnRingToPlayAction<C>(propertyFactory);
}

//////////////
// STATUS TOKEN
//////////////
export function discardStatusToken<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<DiscardStatusProperties, NoInfer<Target>, C> = {}): DiscardStatusAction<C> {
    return new DiscardStatusAction<C>(propertyFactory);
}
export function moveStatusToken<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<MoveTokenProperties, NoInfer<Target>, C>): MoveTokenAction<C> {
    return new MoveTokenAction<C>(propertyFactory);
}

//////////////
// GENERIC
//////////////
export function cancel<Target = unknown, C extends CancellingContext = TriggeredAbilityContext>(propertyFactory: PropsFactory<CancelActionProperties, NoInfer<Target>, C> = {}): CancelAction<C> {
    return new CancelAction<C>(propertyFactory);
}
export function handler<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<HandlerProperties, NoInfer<Target>, C> = {}): HandlerAction<C> {
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
export function conflictLastingEffect<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LastingEffectProperties, NoInfer<Target>, C>): LastingEffectAction<C> {
    return new LastingEffectAction<C>(propertyFactory);
} // duration = 'untilEndOfConflict', effect, targetController, condition, until
export function immediatelyResolveConflict(): GameAction {
    return new HandlerAction({});
}

//////////////
// DUEL
//////////////
export function duelLastingEffect<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<LastingEffectProperties, NoInfer<Target>, C>): LastingEffectAction<C> {
    return new LastingEffectAction<C>(propertyFactory);
} // duration = 'untilEndOfConflict', effect, targetController, condition, until

//////////////
// META
//////////////
export function cardMenu<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<CardMenuProperties, NoInfer<Target>, C>): CardMenuAction<C> {
    return new CardMenuAction<C>(propertyFactory);
}
export function chooseAction<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ChooseActionProperties, NoInfer<Target>, C>): ChooseGameAction<C> {
    return new ChooseGameAction<C>(propertyFactory);
} // choices, activePromptTitle = 'Select one'
export function conditional<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<ConditionalActionProperties, NoInfer<Target>, C>): ConditionalAction<C> {
    return new ConditionalAction<C>(propertyFactory);
}
export function onAffinity<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<AffinityActionProperties, NoInfer<Target>, C>): AffinityAction<C> {
    return new AffinityAction<C>(propertyFactory);
}
export function optional<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<OptionalActionProperties, NoInfer<Target>, C>): OptionalAction<C> {
    return new OptionalAction<C>(propertyFactory);
}
export function ifAble<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<IfAbleActionProperties, NoInfer<Target>, C>): IfAbleAction<C> {
    return new IfAbleAction<C>(propertyFactory);
}
export function joint<C extends AbilityContext = AbilityContext>(gameActions: GameAction<GameActionProperties, EventName, C>[]): JointGameAction<C> {
    return new JointGameAction<C>(gameActions);
} // takes an array of gameActions, not a propertyFactory
export function jointContext<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<JointGameContextProperties, NoInfer<Target>, C>): JointGameContextAction<C> {
    return new JointGameContextAction<C>(propertyFactory);
} // takes an array of gameActions, not a propertyFactory
export function multiple<C extends AbilityContext = AbilityContext>(gameActions: GameAction<GameActionProperties, EventName, C>[]): MultipleGameAction<C> {
    return new MultipleGameAction<C>(gameActions);
} // takes an array of gameActions, not a propertyFactory
export function multipleContext<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<MultipleContextActionProperties, NoInfer<Target>, C>): MultipleContextGameAction<C> {
    return new MultipleContextGameAction<C>(propertyFactory);
}
export function menuPrompt<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<MenuPromptProperties, NoInfer<Target>, C>): MenuPromptAction<C> {
    return new MenuPromptAction<C>(propertyFactory);
}
export function selectCard<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SelectCardProperties, NoInfer<Target>, C>): SelectCardAction<C> {
    return new SelectCardAction<C>(propertyFactory);
}
export function selectToken<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SelectTokenProperties, NoInfer<Target>, C>): SelectTokenAction<C> {
    return new SelectTokenAction<C>(propertyFactory);
}
export function sequential<C extends AbilityContext = AbilityContext>(gameActions: GameAction<GameActionProperties, EventName, C>[]): SequentialAction<C> {
    return new SequentialAction<C>(gameActions);
} // takes an array of gameActions, not a propertyFactory
export function sequentialContext<Target = unknown, C extends AbilityContext = AbilityContext>(propertyFactory: PropsFactory<SequentialContextProperties, NoInfer<Target>, C>): SequentialContextAction<C> {
    return new SequentialContextAction<C>(propertyFactory);
}
