import { AddTokenAction, AddTokenProperties } from './AddTokenAction.js';
import { AffinityAction, AffinityActionProperties } from './AffinityAction.js';
import { AttachAction, AttachActionProperties } from './AttachAction.js';
import { AttachToRingAction, AttachToRingActionProperties } from './AttachToRingAction.js';
import { BowAction, BowActionProperties } from './BowAction.js';
import { BreakAction, BreakProperties } from './BreakAction.js';
import { CancelAction, CancelActionProperties } from './CancelAction.js';
import { CardGameAction } from './CardGameAction.js';
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
import { GameAction } from './GameAction.js';
import { GloryCountAction, GloryCountProperties } from './GloryCountAction.js';
import { HandlerAction, HandlerProperties } from './HandlerAction.js';
import { HonorAction, HonorProperties } from './HonorAction.js';
import { HonorBidAction, HonorBidProperties } from './HonorBidAction.js';
import { IfAbleAction, IfAbleActionProperties } from './IfAbleAction.js';
import { InitiateConflictAction, InitiateConflictProperties } from './InitiateConflictAction.js';
import { JointGameAction } from './JointGameAction.js';
import { JointGameContextProperties, JointGameContextAction } from './JointGameContextAction.js';
import { LastingEffectAction, LastingEffectProperties } from './LastingEffectAction.js';
import { LastingEffectCardAction, LastingEffectCardProperties } from './LastingEffectCardAction.js';
import { LastingEffectRingAction, LastingEffectRingProperties } from './LastingEffectRingAction.js';
import { LookAtAction, LookAtProperties } from './LookAtAction.js';
import { LoseFateAction, LoseFateProperties } from './LoseFateAction.js';
import { LoseHonorAction, LoseHonorProperties } from './LoseHonorAction.js';
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

type PropsFactory<Props> = Props | ((context: any) => Props);

//////////////
// CARD
//////////////
export function addToken(propertyFactory: PropsFactory<AddTokenProperties> = {}): GameAction {
    return new AddTokenAction(propertyFactory);
}
export function attach(propertyFactory: PropsFactory<AttachActionProperties> = {}): GameAction {
    return new AttachAction(propertyFactory);
}
export function attachToRing(propertyFactory: PropsFactory<AttachToRingActionProperties> = {}): GameAction {
    return new AttachToRingAction(propertyFactory);
}
export function bow(propertyFactory: PropsFactory<BowActionProperties> = {}): CardGameAction {
    return new BowAction(propertyFactory);
}
export function breakProvince(propertyFactory: PropsFactory<BreakProperties> = {}): CardGameAction {
    return new BreakAction(propertyFactory);
}
export function cardLastingEffect(propertyFactory: PropsFactory<LastingEffectCardProperties>): GameAction {
    return new LastingEffectCardAction(propertyFactory);
}
export function claimImperialFavor(propertyFactory: PropsFactory<ClaimFavorProperties>): GameAction {
    return new ClaimFavorAction(propertyFactory);
}
export function createToken(propertyFactory: PropsFactory<CreateTokenProperties> = {}): GameAction {
    return new CreateTokenAction(propertyFactory);
}
export function detach(propertyFactory: PropsFactory<DetachActionProperties> = {}): GameAction {
    return new DetachAction(propertyFactory);
}
export function discardCard(propertyFactory: PropsFactory<DiscardCardProperties> = {}): CardGameAction {
    return new DiscardCardAction(propertyFactory);
}
export function discardFromPlay(propertyFactory: PropsFactory<DiscardFromPlayProperties> = {}): GameAction {
    return new DiscardFromPlayAction(propertyFactory);
}
export function dishonor(propertyFactory: PropsFactory<DishonorProperties> = {}): CardGameAction {
    return new DishonorAction(propertyFactory);
}
export function dishonorProvince(propertyFactory: PropsFactory<DishonorProvinceProperties> = {}): GameAction {
    return new DishonorProvinceAction(propertyFactory);
}
export function duel(propertyFactory: PropsFactory<DuelProperties>): GameAction {
    return new DuelAction(propertyFactory);
}
export function duelAddParticipant(propertyFactory: PropsFactory<DuelAddParticipantProperties>): GameAction {
    return new DuelAddParticipantAction(propertyFactory);
}
export function flipDynasty(propertyFactory: PropsFactory<FlipDynastyProperties> = {}): GameAction {
    return new FlipDynastyAction(propertyFactory);
}
export function flipImperialFavor(propertyFactory: PropsFactory<FlipFavorProperties>): GameAction {
    return new FlipFavorAction(propertyFactory);
}
export function honor(propertyFactory: PropsFactory<HonorProperties> = {}): GameAction {
    return new HonorAction(propertyFactory);
}
export function lookAt(propertyFactory: PropsFactory<LookAtProperties> = {}): GameAction {
    return new LookAtAction(propertyFactory);
}
/**
 * default switch = false
 * default shuffle = false
 * default faceup = false
 */
export function moveCard(propertyFactory: PropsFactory<MoveCardProperties>): CardGameAction {
    return new MoveCardAction(propertyFactory);
}
export function moveToConflict(propertyFactory: PropsFactory<MoveToConflictProperties> = {}): CardGameAction {
    return new MoveToConflictAction(propertyFactory);
}
/**
 * default amount = 1
 */
export function placeFate(propertyFactory: PropsFactory<PlaceFateProperties> = {}): GameAction {
    return new PlaceFateAction(propertyFactory);
}
/**
 * default amount = 1
 */
export function placeFateAttachment(propertyFactory: PropsFactory<PlaceFateAttachmentProperties> = {}): GameAction {
    return new PlaceFateAttachmentAction(propertyFactory);
}
/**
 * default resetOnCancel = false
 */
export function playCard(propertyFactory: PropsFactory<PlayCardProperties> = {}): GameAction {
    return new PlayCardAction(propertyFactory);
}
export function performGloryCount(propertyFactory: PropsFactory<GloryCountProperties>): GameAction {
    return new GloryCountAction(propertyFactory);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function putIntoConflict(propertyFactory: PropsFactory<PutIntoPlayProperties> = {}): GameAction {
    return new PutIntoPlayAction(propertyFactory);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function putIntoPlay(propertyFactory: PropsFactory<PutIntoPlayProperties> = {}): GameAction {
    return new PutIntoPlayAction(propertyFactory, false);
}
export function putIntoProvince(propertyFactory: PropsFactory<PutInProvinceProperties>): GameAction {
    return new PutInProvinceAction(propertyFactory);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function opponentPutIntoPlay(propertyFactory: PropsFactory<OpponentPutIntoPlayProperties> = {}): GameAction {
    return new OpponentPutIntoPlayAction(propertyFactory, false);
}
export function ready(propertyFactory: PropsFactory<ReadyProperties> = {}): GameAction {
    return new ReadyAction(propertyFactory);
}
/**
 * default amount = 1
 */
export function removeFate(propertyFactory: PropsFactory<RemoveFateProperties> = {}): CardGameAction {
    return new RemoveFateAction(propertyFactory);
}
export function removeFromGame(propertyFactory: PropsFactory<RemoveFromGameProperties> = {}): CardGameAction {
    return new RemoveFromGameAction(propertyFactory);
}
export function resolveAbility(propertyFactory: PropsFactory<ResolveAbilityProperties>): GameAction {
    return new ResolveAbilityAction(propertyFactory);
}
export function restoreProvince(propertyFactory: PropsFactory<RestoreProvinceProperties> = {}): GameAction {
    return new RestoreProvinceAction(propertyFactory);
}
/**
 * default bottom = false
 */
export function returnToDeck(propertyFactory: PropsFactory<ReturnToDeckProperties> = {}): CardGameAction {
    return new ReturnToDeckAction(propertyFactory);
}
export function returnToHand(propertyFactory: PropsFactory<ReturnToHandProperties> = {}): CardGameAction {
    return new ReturnToHandAction(propertyFactory);
}
/**
 * default chatMessage = false
 */
export function reveal(propertyFactory: PropsFactory<RevealProperties> = {}): CardGameAction {
    return new RevealAction(propertyFactory);
}
export function sendHome(propertyFactory: PropsFactory<SendHomeProperties> = {}): GameAction {
    return new SendHomeAction(propertyFactory);
}
export function sacrifice(propertyFactory: PropsFactory<DiscardFromPlayProperties> = {}): CardGameAction {
    return new DiscardFromPlayAction(propertyFactory, true);
}
export function taint(propertyFactory: PropsFactory<TaintProperties> = {}): CardGameAction {
    return new TaintAction(propertyFactory);
}
export function takeControl(propertyFactory: PropsFactory<TakeControlProperties> = {}): GameAction {
    return new TakeControlAction(propertyFactory);
}
export function triggerAbility(propertyFactory: PropsFactory<TriggerAbilityProperties>): GameAction {
    return new TriggerAbilityAction(propertyFactory);
}
export function turnFacedown(propertyFactory: PropsFactory<TurnCardFacedownProperties> = {}): GameAction {
    return new TurnCardFacedownAction(propertyFactory);
}
export function gainStatusToken(propertyFactory: PropsFactory<GainStatusTokenProperties> = {}): GameAction {
    return new GainStatusTokenAction(propertyFactory);
}
export function moveConflict(propertyFactory: PropsFactory<MoveConflictProperties> = {}): GameAction {
    return new MoveConflictAction(propertyFactory);
}
/**
 * default hideWhenFaceup = true
 */
export function placeCardUnderneath(propertyFactory: PropsFactory<PlaceCardUnderneathProperties>): GameAction {
    return new PlaceCardUnderneathAction(propertyFactory);
}

//////////////
// PLAYER
//////////////
/**
 * default amount = 1
 */
export function chosenDiscard(propertyFactory: PropsFactory<ChosenDiscardProperties> = {}): GameAction {
    return new ChosenDiscardAction(propertyFactory);
}
/**
 * default amount = 1
 */
export function chosenReturnToDeck(propertyFactory: PropsFactory<ChosenReturnToDeckProperties> = {}): GameAction {
    return new ChosenReturnToDeckAction(propertyFactory);
}
/**
 * default amount = -1 (whole deck)
 * default reveal = true
 * default cardCondition = always true
 */
export function deckSearch(propertyFactory: PropsFactory<DeckSearchProperties>): GameAction {
    return new DeckSearchAction(propertyFactory);
}
/**
 * default amount = 1
 */
export function discardAtRandom(propertyFactory: PropsFactory<RandomDiscardProperties> = {}): GameAction {
    return new RandomDiscardAction(propertyFactory);
}
/**
 * default amount = 1
 */
export function discardMatching(propertyFactory: PropsFactory<MatchingDiscardProperties> = {}): GameAction {
    return new MatchingDiscardAction(propertyFactory);
}
/**
 * default amount = 1
 */
export function draw(propertyFactory: PropsFactory<DrawProperties> = {}): GameAction {
    return new DrawAction(propertyFactory);
}
/**
 * default amount = 1
 * default faceup = false
 */
export function fillProvince(propertyFactory: PropsFactory<FillProvinceProperties>): GameAction {
    return new FillProvinceAction(propertyFactory);
}
export function gainFate(propertyFactory: PropsFactory<GainFateProperties> = {}): GameAction {
    return new GainFateAction(propertyFactory);
} // amount = 1
export function gainHonor(propertyFactory: PropsFactory<GainHonorProperties> = {}): GameAction {
    return new GainHonorAction(propertyFactory);
} // amount = 1
/**
 * default giveHonor = false
 * default players = Players.Any
 * default prohibitedBids = All bids allowed
 */
export function honorBid(propertyFactory: PropsFactory<HonorBidProperties> = {}): GameAction {
    return new HonorBidAction(propertyFactory);
}
export function fateBid(propertyFactory: PropsFactory<FateBidProperties> = {}): GameAction {
    return new FateBidAction(propertyFactory);
}
export function initiateConflict(propertyFactory: PropsFactory<InitiateConflictProperties> = {}): GameAction {
    return new InitiateConflictAction(propertyFactory);
} // canPass = true
export function loseFate(propertyFactory: PropsFactory<LoseFateProperties> = {}): GameAction {
    return new LoseFateAction(propertyFactory);
}
export function loseHonor(propertyFactory: PropsFactory<LoseHonorProperties> = {}): GameAction {
    return new LoseHonorAction(propertyFactory);
} // amount = 1
export function loseImperialFavor(propertyFactory: PropsFactory<DiscardFavorProperties> = {}): GameAction {
    return new DiscardFavorAction(propertyFactory);
}
export function modifyBid(propertyFactory: PropsFactory<ModifyBidProperties> = {}): GameAction {
    return new ModifyBidAction(propertyFactory);
} // amount = 1, direction = 'increast', promptPlayer = false
export function playerLastingEffect(propertyFactory: PropsFactory<LastingEffectProperties>): GameAction {
    return new LastingEffectAction(propertyFactory);
} // duration = 'untilEndOfConflict', effect, targetController, condition, until
export function refillFaceup(propertyFactory: PropsFactory<RefillFaceupProperties>): GameAction {
    return new RefillFaceupAction(propertyFactory);
} // location
export function setHonorDial(propertyFactory: PropsFactory<SetDialProperties>): GameAction {
    return new SetDialAction(propertyFactory);
} // value
export function shuffleDeck(propertyFactory: PropsFactory<ShuffleDeckProperties>): GameAction {
    return new ShuffleDeckAction(propertyFactory);
}
export function takeFate(propertyFactory: PropsFactory<TransferFateProperties> = {}): GameAction {
    return new TransferFateAction(propertyFactory);
} // amount = 1
export function takeHonor(propertyFactory: PropsFactory<TransferHonorProperties> = {}): GameAction {
    return new TransferHonorAction(propertyFactory);
} // amount = 1

//////////////
// RING
//////////////
export function placeFateOnRing(propertyFactory: PropsFactory<PlaceFateRingProperties> = {}): GameAction {
    return new PlaceFateRingAction(propertyFactory);
} // amount = 1, origin
export function resolveConflictRing(propertyFactory: PropsFactory<RingActionProperties> = {}): GameAction {
    return new ResolveConflictRingAction(propertyFactory);
} // resolveAsAttacker = true
export function resolveRingEffect(propertyFactory: PropsFactory<ResolveElementProperties> = {}): GameAction {
    return new ResolveElementAction(propertyFactory);
} // options = false
export function returnRing(propertyFactory: PropsFactory<ReturnRingProperties> = {}): GameAction {
    return new ReturnRingAction(propertyFactory);
}
export function ringLastingEffect(propertyFactory: PropsFactory<LastingEffectRingProperties>): GameAction {
    return new LastingEffectRingAction(propertyFactory);
} // duration = 'untilEndOfConflict', effect, condition, until
export function selectRing(propertyFactory: PropsFactory<SelectRingProperties>): GameAction {
    return new SelectRingAction(propertyFactory);
}
export function switchConflictElement(propertyFactory: PropsFactory<SwitchConflictElementProperties> = {}): GameAction {
    return new SwitchConflictElementAction(propertyFactory);
}
export function switchConflictType(propertyFactory: PropsFactory<SwitchConflictTypeProperties> = {}): GameAction {
    return new SwitchConflictTypeAction(propertyFactory);
}
export function takeFateFromRing(propertyFactory: PropsFactory<TakeFateRingProperties> = {}): GameAction {
    return new TakeFateRingAction(propertyFactory);
} // amount = 1
export function takeRing(propertyFactory: PropsFactory<TakeRingProperties> = {}): GameAction {
    return new TakeRingAction(propertyFactory);
}
export function claimRing(propertyFactory: PropsFactory<ClaimRingProperties> = {}): GameAction {
    return new ClaimRingAction(propertyFactory);
}
export function removeRingFromPlay(propertyFactory: PropsFactory<RemoveRingFromPlayProperties> = {}): GameAction {
    return new RemoveRingFromPlayAction(propertyFactory);
}
export function returnRingToPlay(propertyFactory: PropsFactory<ReturnRingToPlayProperties> = {}): GameAction {
    return new ReturnRingToPlayAction(propertyFactory);
}

//////////////
// STATUS TOKEN
//////////////
export function discardStatusToken(propertyFactory: PropsFactory<DiscardStatusProperties> = {}): GameAction {
    return new DiscardStatusAction(propertyFactory);
}
export function moveStatusToken(propertyFactory: PropsFactory<MoveTokenProperties>): GameAction {
    return new MoveTokenAction(propertyFactory);
}

//////////////
// GENERIC
//////////////
export function cancel(propertyFactory: PropsFactory<CancelActionProperties> = {}): GameAction {
    return new CancelAction(propertyFactory);
}
export function handler(propertyFactory: PropsFactory<HandlerProperties>): GameAction {
    return new HandlerAction(propertyFactory);
}
export function noAction(): GameAction {
    const action = new HandlerAction({});
    (action as unknown as { isNoAction: boolean }).isNoAction = true;
    return action;
}

//////////////
// CONFLICT
//////////////
export function conflictLastingEffect(propertyFactory: PropsFactory<LastingEffectProperties>): GameAction {
    return new LastingEffectAction(propertyFactory);
} // duration = 'untilEndOfConflict', effect, targetController, condition, until
export function immediatelyResolveConflict(): GameAction {
    return new HandlerAction({});
}

//////////////
// DUEL
//////////////
export function duelLastingEffect(propertyFactory: PropsFactory<LastingEffectProperties>): GameAction {
    return new LastingEffectAction(propertyFactory);
} // duration = 'untilEndOfConflict', effect, targetController, condition, until

//////////////
// META
//////////////
export function cardMenu(propertyFactory: PropsFactory<CardMenuProperties>): GameAction {
    return new CardMenuAction(propertyFactory);
}
export function chooseAction(propertyFactory: PropsFactory<ChooseActionProperties>): GameAction {
    return new ChooseGameAction(propertyFactory);
} // choices, activePromptTitle = 'Select one'
export function conditional(propertyFactory: PropsFactory<ConditionalActionProperties>): GameAction {
    return new ConditionalAction(propertyFactory);
}
export function onAffinity(propertyFactory: PropsFactory<AffinityActionProperties>): GameAction {
    return new AffinityAction(propertyFactory);
}
export function ifAble(propertyFactory: PropsFactory<IfAbleActionProperties>): GameAction {
    return new IfAbleAction(propertyFactory);
}
export function joint(gameActions: GameAction[]): GameAction {
    return new JointGameAction(gameActions);
} // takes an array of gameActions, not a propertyFactory
export function jointContext(propertyFactory: PropsFactory<JointGameContextProperties>): GameAction {
    return new JointGameContextAction(propertyFactory);
} // takes an array of gameActions, not a propertyFactory
export function multiple(gameActions: GameAction[]): GameAction {
    return new MultipleGameAction(gameActions);
} // takes an array of gameActions, not a propertyFactory
export function multipleContext(propertyFactory: PropsFactory<MultipleContextActionProperties>): GameAction {
    return new MultipleContextGameAction(propertyFactory);
}
export function menuPrompt(propertyFactory: PropsFactory<MenuPromptProperties>): GameAction {
    return new MenuPromptAction(propertyFactory);
}
export function selectCard(propertyFactory: PropsFactory<SelectCardProperties>): GameAction {
    return new SelectCardAction(propertyFactory);
}
export function selectToken(propertyFactory: PropsFactory<SelectTokenProperties>): GameAction {
    return new SelectTokenAction(propertyFactory);
}
export function sequential(gameActions: GameAction[]): GameAction {
    return new SequentialAction(gameActions);
} // takes an array of gameActions, not a propertyFactory
export function sequentialContext(propertyFactory: PropsFactory<SequentialContextProperties>): GameAction {
    return new SequentialContextAction(propertyFactory);
}
