import type { MessageArgs } from '../GameChat.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type { AbilityContext } from '../AbilityContext.js';
import { AddTokenAction, type AddTokenProperties } from './AddTokenAction.js';
import { AffinityAction, type AffinityProperties } from './AffinityAction.js';
import { AssignRolesAction, type AssignRolesProperties } from './AssignRolesAction.js';
import { AttachAction, type AttachProperties } from './AttachAction.js';
import { RearrangeDeckAction, type RearrangeDeckProperties } from './RearrangeDeckAction.js';
import { AttachToRingAction, type AttachToRingProperties } from './AttachToRingAction.js';
import { BowAction, type BowProperties } from './BowAction.js';
import { BreakProvinceAction, type BreakProperties } from './BreakProvinceAction.js';
import { CancelAction, type CancelProperties, type CancellingContext } from './CancelAction.js';
import { CardMenuAction, type CardMenuProperties } from './CardMenuAction.js';
import { type ChooseActionProperties, ChooseGameAction } from './ChooseGameAction.js';
import { ChooseAmountAction, type ChooseAmountProperties } from './ChooseAmountAction.js';
import { ChosenDiscardAction, type ChosenDiscardProperties } from './ChosenDiscardAction.js';
import { ChosenReturnToDeckAction, type ChosenReturnToDeckProperties } from './ChosenReturnToDeckAction.js';
import { ClaimImperialFavorAction, type ClaimFavorProperties } from './ClaimImperialFavorAction.js';
import { ClaimRingAction, type ClaimRingProperties } from './ClaimRingAction.js';
import { ConditionalAction, type ConditionalProperties } from './ConditionalAction.js';
import { CreateTokenAction, type CreateTokenProperties } from './CreateTokenAction.js';
import { DeckSearchAction, type DeckSearchProperties } from './DeckSearchAction.js';
import { DetachAction, type DetachProperties } from './DetachAction.js';
import { DiscardCardAction, type DiscardCardProperties } from './DiscardCardAction.js';
import { LoseImperialFavorAction, type DiscardFavorProperties } from './LoseImperialFavorAction.js';
import { DiscardFromPlayAction, type DiscardFromPlayProperties } from './LeavesPlayAction.js';
import { DiscardStatusTokenAction, type DiscardStatusProperties } from './DiscardStatusTokenAction.js';
import { DishonorAction, type DishonorProperties } from './DishonorAction.js';
import { DishonorProvinceAction, type DishonorProvinceProperties } from './DishonorProvinceAction.js';
import { DrawAction, type DrawProperties } from './DrawAction.js';
import { DuelAction, type DuelProperties } from './DuelAction.js';
import { DuelAddParticipantAction, type DuelAddParticipantProperties } from './DuelAddParticipantAction.js';
import { FateBidAction, type FateBidProperties } from './FateBidAction.js';
import { FillProvinceAction, type FillProvinceProperties } from './FillProvinceAction.js';
import { FlipDynastyAction, type FlipDynastyProperties } from './FlipDynastyAction.js';
import { FlipImperialFavorAction, type FlipFavorProperties } from './FlipImperialFavorAction.js';
import { GainFateAction, type GainFateProperties } from './GainFateAction.js';
import { GainHonorAction, type GainHonorProperties } from './GainHonorAction.js';
import { GainStatusTokenAction, type GainStatusTokenProperties } from './GainStatusTokenAction.js';
import type { GameAction, GameActionProperties, GameActionTarget } from './GameAction.js';
import { CardType, Duration, Location, type EventName } from '../Constants.js';
import { delayedEffect } from '../Effects/Library/delayedEffect.js';
import type { GameObject } from '../GameObject.js';
import { PerformGloryCountAction, type GloryCountProperties } from './PerformGloryCountAction.js';
import { HandlerAction, type HandlerProperties } from './HandlerAction.js';
import { HonorAction, type HonorProperties } from './HonorAction.js';
import { HonorBidAction, type HonorBidProperties } from './HonorBidAction.js';
import { IfAbleAction, type IfAbleProperties } from './IfAbleAction.js';
import { InitiateConflictAction, type InitiateConflictProperties } from './InitiateConflictAction.js';
import { InjureAction, type InjureProperties } from './InjureAction.js';
import { JointGameAction } from './JointGameAction.js';
import { DuelLastingEffectAction, LastingEffectAction, PlayerLastingEffectAction, type LastingEffectProperties, type PlayerLastingEffectInput } from './LastingEffectAction.js';
import { CardLastingEffectAction, type LastingEffectCardProperties } from './CardLastingEffectAction.js';
import { RingLastingEffectAction, type LastingEffectRingProperties } from './RingLastingEffectAction.js';
import { LookAtAction, type LookAtProperties } from './LookAtAction.js';
import { LoseFateAction, type LoseFateProperties } from './LoseFateAction.js';
import { LoseHonorAction, type LoseHonorProperties } from './LoseHonorAction.js';
import { OptionalAction, type OptionalProperties } from './OptionalAction.js';
import { DiscardMatchingAction, type MatchingDiscardProperties } from './DiscardMatchingAction.js';
import { ModifyBidAction, type ModifyBidProperties } from './ModifyBidAction.js';
import { MoveCardAction, type MoveCardProperties } from './MoveCardAction.js';
import { MoveConflictAction, type MoveConflictProperties } from './MoveConflictAction.js';
import { MoveToConflictAction, type MoveToConflictProperties } from './MoveToConflictAction.js';
import { MoveStatusTokenAction, type MoveTokenProperties } from './MoveStatusTokenAction.js';
import { MultipleGameAction, type GameActionList } from './MultipleGameAction.js';
import { OpponentPutIntoPlayAction, type OpponentPutIntoPlayProperties } from './OpponentPutIntoPlayAction.js';
import { PlaceCardUnderneathAction, type PlaceCardUnderneathProperties } from './PlaceCardUnderneathAction.js';
import { PlaceFateAction, type PlaceFateProperties } from './PlaceFateAction.js';
import { PlaceFateOnRingAction, type PlaceFateRingProperties } from './PlaceFateOnRingAction.js';
import { PlayCardAction, type PlayCardProperties } from './PlayCardAction.js';
import { PutIntoProvinceAction, type PutInProvinceProperties } from './PutIntoProvinceAction.js';
import { PutIntoPlayAction, type PutIntoPlayProperties } from './PutIntoPlayAction.js';
import { DiscardAtRandomAction, type RandomDiscardProperties } from './DiscardAtRandomAction.js';
import { ReadyAction, type ReadyProperties } from './ReadyAction.js';
import { RefillFaceupAction, type RefillFaceupProperties } from './RefillFaceupAction.js';
import { RemoveFateAction, type RemoveFateProperties } from './RemoveFateAction.js';
import { RemoveFromGameAction, type RemoveFromGameProperties } from './RemoveFromGameAction.js';
import { RemoveRingFromPlayAction, type RemoveRingFromPlayProperties } from './RemoveRingFromPlayAction.js';
import { ResolveAbilityAction, type ResolveAbilityProperties } from './ResolveAbilityAction.js';
import { ResolveConflictRingAction } from './ResolveConflictRingAction.js';
import { ResolveRingEffectAction, type ResolveElementProperties } from './ResolveRingEffectAction.js';
import { RestoreProvinceAction, type RestoreProvinceProperties } from './RestoreProvinceAction.js';
import { ReturnRingAction, type ReturnRingProperties } from './ReturnRingAction.js';
import { ReturnRingToPlayAction, type ReturnRingToPlayProperties } from './ReturnRingToPlayAction.js';
import { ReturnToDeckAction, type ReturnToDeckProperties } from './ReturnToDeckAction.js';
import { ReturnToHandAction, type ReturnToHandProperties } from './ReturnToHandAction.js';
import { RevealAction, type RevealProperties } from './RevealAction.js';
import type { RingActionProperties } from './RingAction.js';
import { eraseSelectCardProperties, eraseSelectCardsProperties, SelectCardAction, type SelectCardProperties, type SelectCardsProperties } from './SelectCardAction.js';
import type { MultiCardMode } from '../CardSelector.js';
import type { CardTypes } from '../types/CardOfType.js';
import { SelectRingAction, type SelectRingProperties } from './SelectRingActions.js';
import { SelectTokenAction, type SelectTokenProperties } from './SelectTokenAction.js';
import { SendHomeAction, type SendHomeProperties } from './SendHomeAction.js';
import { SequentialAction } from './SequentialAction.js';
import { SetHonorDialAction, type SetDialProperties } from './SetHonorDialAction.js';
import { SetAsideAction, type SetAsideProperties } from './SetAsideAction.js';
import { PlaceInProvinceAction, type PlaceInProvinceProperties } from './PlaceInProvinceAction.js';
import { NameCardAction, type NameCardProperties } from './NameCardAction.js';
import { TokenFromTopCardAction, type TokenFromTopCardProperties } from './TokenFromTopCardAction.js';
import { ShuffleDeckAction, type ShuffleDeckProperties } from './ShuffleDeckAction.js';
import { SwitchConflictElementAction, type SwitchConflictElementProperties } from './SwitchConflictElementAction.js';
import { SwitchConflictTypeAction, type SwitchConflictTypeProperties } from './SwitchConflictTypeAction.js';
import { TaintAction, type TaintProperties } from './TaintAction.js';
import { TakeControlAction, type TakeControlProperties } from './TakeControlAction.js';
import { TakeFateFromRingAction, type TakeFateRingProperties } from './TakeFateFromRingAction.js';
import { TakeRingAction, type TakeRingProperties } from './TakeRingAction.js';
import { TakeFateAction, type TransferFateProperties } from './TakeFateAction.js';
import { TakeHonorAction, type TransferHonorProperties } from './TakeHonorAction.js';
import { TriggerAbilityAction, type TriggerAbilityProperties } from './TriggerAbilityAction.js';
import { TurnFacedownAction, type TurnCardFacedownProperties } from './TurnFacedownAction.js';
import type { Derivable } from '../utils/helpers.js';

export function addToken<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<AddTokenProperties, Context> = {}): AddTokenAction<Context> {
    return new AddTokenAction<Context>(propertyFactory);
}
export function attach<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<AttachProperties, Context> = {}): AttachAction<Context> {
    return new AttachAction<Context>(propertyFactory);
}
export function attachToRing<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<AttachToRingProperties, Context> = {}): AttachToRingAction<Context> {
    return new AttachToRingAction<Context>(propertyFactory);
}
export function bow<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<BowProperties, Context> = {}): BowAction<Context> {
    return new BowAction<Context>(propertyFactory);
}
export function breakProvince<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<BreakProperties, Context> = {}): BreakProvinceAction<Context> {
    return new BreakProvinceAction<Context>(propertyFactory);
}
export function cardLastingEffect<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<LastingEffectCardProperties<Context>, Context>): CardLastingEffectAction<Context> {
    return new CardLastingEffectAction<Context>(propertyFactory);
}
/** Resolves `gameAction` on the target cards (the source by default) when this conflict ends; `onlyIf` is checked then. */
export function atEndOfConflict<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<AtEndOfConflictProperties<Context>, Context>): CardLastingEffectAction<Context> {
    return cardLastingEffect<Context>((context) => {
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
export type AtEndOfConflictProperties<Context extends AbilityContext = AbilityContext> = Omit<LastingEffectCardProperties<Context>, 'duration' | 'until' | 'condition' | 'effect'> & {
    gameAction: GameAction;
    onlyIf?(context: Context): boolean;
    message?(context: Context, targets: GameObject[]): MessageArgs;
};
export function claimImperialFavor<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ClaimFavorProperties, Context>): ClaimImperialFavorAction<Context> {
    return new ClaimImperialFavorAction<Context>(propertyFactory);
}
export function createToken<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<CreateTokenProperties, Context>): CreateTokenAction<Context> {
    return new CreateTokenAction<Context>(propertyFactory);
}
export function detach<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DetachProperties, Context> = {}): DetachAction<Context> {
    return new DetachAction<Context>(propertyFactory);
}
export function discardCard<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DiscardCardProperties, Context> = {}): DiscardCardAction<Context> {
    return new DiscardCardAction<Context>(propertyFactory);
}
export function discardFromPlay<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DiscardFromPlayProperties, Context> = {}): DiscardFromPlayAction<Context> {
    return new DiscardFromPlayAction<Context>(propertyFactory);
}
export function dishonor<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DishonorProperties, Context> = {}): DishonorAction<Context> {
    return new DishonorAction<Context>(propertyFactory);
}
export function dishonorProvince<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DishonorProvinceProperties, Context> = {}): DishonorProvinceAction<Context> {
    return new DishonorProvinceAction<Context>(propertyFactory);
}
export function duel<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DuelProperties<Context>, Context>): DuelAction<Context> {
    return new DuelAction<Context>(propertyFactory);
}
export function duelAddParticipant<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DuelAddParticipantProperties, Context>): DuelAddParticipantAction<Context> {
    return new DuelAddParticipantAction<Context>(propertyFactory);
}
export function flipDynasty<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<FlipDynastyProperties, Context> = {}): FlipDynastyAction<Context> {
    return new FlipDynastyAction<Context>(propertyFactory);
}
export function flipImperialFavor<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<FlipFavorProperties, Context>): FlipImperialFavorAction<Context> {
    return new FlipImperialFavorAction<Context>(propertyFactory);
}
export function honor<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<HonorProperties, Context> = {}): HonorAction<Context> {
    return new HonorAction<Context>(propertyFactory);
}
export function injure<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<InjureProperties, Context> = {}): InjureAction<Context> {
    return new InjureAction<Context>(propertyFactory);
}

export function lookAt<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<LookAtProperties<Context>, Context> = {}): LookAtAction<Context> {
    return new LookAtAction<Context>(propertyFactory);
}
export function moveCard<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<MoveCardProperties, Context>): MoveCardAction<Context> {
    return new MoveCardAction<Context>(propertyFactory);
}
export function moveToConflict<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<MoveToConflictProperties, Context> = {}): MoveToConflictAction<Context> {
    return new MoveToConflictAction<Context>(propertyFactory);
}
export function placeFate<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PlaceFateProperties, Context> = {}): PlaceFateAction<Context> {
    return new PlaceFateAction<Context>(propertyFactory);
}
export function playCard<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PlayCardProperties, Context> = {}): PlayCardAction<Context> {
    return new PlayCardAction<Context>(propertyFactory);
}
export function performGloryCount<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<GloryCountProperties, Context>): PerformGloryCountAction<Context> {
    return new PerformGloryCountAction<Context>(propertyFactory);
}
export function putIntoConflict<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PutIntoPlayProperties, Context> = {}): PutIntoPlayAction<Context> {
    return new PutIntoPlayAction<Context>(propertyFactory, true);
}
export function putIntoPlay<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PutIntoPlayProperties, Context> = {}): PutIntoPlayAction<Context> {
    return new PutIntoPlayAction<Context>(propertyFactory, false);
}
export function putIntoProvince<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PutInProvinceProperties, Context>): PutIntoProvinceAction<Context> {
    return new PutIntoProvinceAction<Context>(propertyFactory);
}
export function opponentPutIntoPlay<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<OpponentPutIntoPlayProperties, Context> = {}): OpponentPutIntoPlayAction<Context> {
    return new OpponentPutIntoPlayAction<Context>(propertyFactory, false);
}
export function ready<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ReadyProperties, Context> = {}): ReadyAction<Context> {
    return new ReadyAction<Context>(propertyFactory);
}
export function removeFate<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RemoveFateProperties, Context> = {}): RemoveFateAction<Context> {
    return new RemoveFateAction<Context>(propertyFactory);
}
export function removeFromGame<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RemoveFromGameProperties, Context> = {}): RemoveFromGameAction<Context> {
    return new RemoveFromGameAction<Context>(propertyFactory);
}
export function resolveAbility<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ResolveAbilityProperties, Context>): ResolveAbilityAction<Context> {
    return new ResolveAbilityAction<Context>(propertyFactory);
}
export function restoreProvince<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RestoreProvinceProperties, Context> = {}): RestoreProvinceAction<Context> {
    return new RestoreProvinceAction<Context>(propertyFactory);
}
export function returnToDeck<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ReturnToDeckProperties, Context> = {}): ReturnToDeckAction<Context> {
    return new ReturnToDeckAction<Context>(propertyFactory);
}
export function returnToHand<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ReturnToHandProperties, Context> = {}): ReturnToHandAction<Context> {
    return new ReturnToHandAction<Context>(propertyFactory);
}
export function reveal<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RevealProperties, Context> = {}): RevealAction<Context> {
    return new RevealAction<Context>(propertyFactory);
}
export function sendHome<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<SendHomeProperties, Context> = {}): SendHomeAction<Context> {
    return new SendHomeAction<Context>(propertyFactory);
}
export function sacrifice<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DiscardFromPlayProperties, Context> = {}): DiscardFromPlayAction<Context> {
    return new DiscardFromPlayAction<Context>(propertyFactory, true);
}
export function taint<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TaintProperties, Context> = {}): TaintAction<Context> {
    return new TaintAction<Context>(propertyFactory);
}
export function takeControl<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TakeControlProperties, Context> = {}): TakeControlAction<Context> {
    return new TakeControlAction<Context>(propertyFactory);
}
export function triggerAbility<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TriggerAbilityProperties, Context>): TriggerAbilityAction<Context> {
    return new TriggerAbilityAction<Context>(propertyFactory);
}
export function turnFacedown<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TurnCardFacedownProperties, Context> = {}): TurnFacedownAction<Context> {
    return new TurnFacedownAction<Context>(propertyFactory);
}
export function gainStatusToken<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<GainStatusTokenProperties, Context> = {}): GainStatusTokenAction<Context> {
    return new GainStatusTokenAction<Context>(propertyFactory);
}
export function moveConflict<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<MoveConflictProperties, Context> = {}): MoveConflictAction<Context> {
    return new MoveConflictAction<Context>(propertyFactory);
}
export function placeCardUnderneath<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PlaceCardUnderneathProperties, Context>): PlaceCardUnderneathAction<Context> {
    return new PlaceCardUnderneathAction<Context>(propertyFactory);
}

export function chosenDiscard<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ChosenDiscardProperties<Context>, Context> = {}): ChosenDiscardAction<Context> {
    return new ChosenDiscardAction<Context>(propertyFactory);
}
export function chosenReturnToDeck<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ChosenReturnToDeckProperties, Context> = {}): ChosenReturnToDeckAction<Context> {
    return new ChosenReturnToDeckAction<Context>(propertyFactory);
}
export function deckSearch<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DeckSearchProperties<Context>, Context>): DeckSearchAction<Context> {
    return new DeckSearchAction<Context>(propertyFactory);
}
export function discardAtRandom<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RandomDiscardProperties, Context> = {}): DiscardAtRandomAction<Context> {
    return new DiscardAtRandomAction<Context>(propertyFactory);
}
export function discardMatching<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<MatchingDiscardProperties<Context>, Context> = {}): DiscardMatchingAction<Context> {
    return new DiscardMatchingAction<Context>(propertyFactory);
}
export function draw<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DrawProperties, Context> = {}): DrawAction<Context> {
    return new DrawAction<Context>(propertyFactory);
}
export function fillProvince<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<FillProvinceProperties, Context>): FillProvinceAction<Context> {
    return new FillProvinceAction<Context>(propertyFactory);
}
export function gainFate<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<GainFateProperties, Context> = {}): GainFateAction<Context> {
    return new GainFateAction<Context>(propertyFactory);
}
export function gainHonor<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<GainHonorProperties, Context> = {}): GainHonorAction<Context> {
    return new GainHonorAction<Context>(propertyFactory);
}
export function honorBid<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<HonorBidProperties<Context>, Context> = {}): HonorBidAction<Context> {
    return new HonorBidAction<Context>(propertyFactory);
}
export function fateBid<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<FateBidProperties<Context>, Context> = {}): FateBidAction<Context> {
    return new FateBidAction<Context>(propertyFactory);
}
export function initiateConflict<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<InitiateConflictProperties, Context> = {}): InitiateConflictAction<Context> {
    return new InitiateConflictAction<Context>(propertyFactory);
}
export function loseFate<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<LoseFateProperties, Context> = {}): LoseFateAction<Context> {
    return new LoseFateAction<Context>(propertyFactory);
}
export function loseHonor<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<LoseHonorProperties, Context> = {}): LoseHonorAction<Context> {
    return new LoseHonorAction<Context>(propertyFactory);
}
export function loseImperialFavor<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DiscardFavorProperties, Context> = {}): LoseImperialFavorAction<Context> {
    return new LoseImperialFavorAction<Context>(propertyFactory);
}
export function modifyBid<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ModifyBidProperties, Context> = {}): ModifyBidAction<Context> {
    return new ModifyBidAction<Context>(propertyFactory);
}
export function playerLastingEffect<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PlayerLastingEffectInput<Context>, Context>): PlayerLastingEffectAction<Context> {
    return new PlayerLastingEffectAction<Context>(propertyFactory);
}
export function refillFaceup<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RefillFaceupProperties, Context>): RefillFaceupAction<Context> {
    return new RefillFaceupAction<Context>(propertyFactory);
}
export function setHonorDial<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<SetDialProperties, Context>): SetHonorDialAction<Context> {
    return new SetHonorDialAction<Context>(propertyFactory);
}
export function shuffleDeck<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ShuffleDeckProperties, Context>): ShuffleDeckAction<Context> {
    return new ShuffleDeckAction<Context>(propertyFactory);
}
/** "Name a card": the chooser names a card, then `gameAction(cardName)` resolves. */
export function nameCard<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<NameCardProperties<Context>, Context>): NameCardAction<Context> {
    return new NameCardAction<Context>(propertyFactory);
}
/** The top card of a player's deck becomes a token, then `gameAction(token)` resolves. */
export function tokenFromTopCard<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TokenFromTopCardProperties, Context>): TokenFromTopCardAction<Context> {
    return new TokenFromTopCardAction<Context>(propertyFactory);
}
/** Puts a dynasty card from out of play into a province, faceup by default, optionally discarding the cards there first. */
export function placeInProvince<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PlaceInProvinceProperties, Context> = {}): PlaceInProvinceAction<Context> {
    return new PlaceInProvinceAction<Context>(propertyFactory);
}
/** Sets cards aside, out of play; optionally hidden, returned at the end of the conflict, or playable by a player. */
export function setAside<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<SetAsideProperties<Context>, Context> = {}): SetAsideAction<Context> {
    return new SetAsideAction<Context>(propertyFactory);
}
export function takeFate<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TransferFateProperties, Context> = {}): TakeFateAction<Context> {
    return new TakeFateAction<Context>(propertyFactory);
}
export function takeHonor<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TransferHonorProperties, Context> = {}): TakeHonorAction<Context> {
    return new TakeHonorAction<Context>(propertyFactory);
}

export function placeFateOnRing<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<PlaceFateRingProperties, Context> = {}): PlaceFateOnRingAction<Context> {
    return new PlaceFateOnRingAction<Context>(propertyFactory);
}
export function resolveConflictRing<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RingActionProperties, Context> = {}): ResolveConflictRingAction<Context> {
    return new ResolveConflictRingAction<Context>(propertyFactory);
}
export function resolveRingEffect<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ResolveElementProperties, Context> = {}): ResolveRingEffectAction<Context> {
    return new ResolveRingEffectAction<Context>(propertyFactory);
}
export function returnRing<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ReturnRingProperties, Context> = {}): ReturnRingAction<Context> {
    return new ReturnRingAction<Context>(propertyFactory);
}
export function ringLastingEffect<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<LastingEffectRingProperties<Context>, Context>): RingLastingEffectAction<Context> {
    return new RingLastingEffectAction<Context>(propertyFactory);
}
export function selectRing<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<SelectRingProperties<Context>, Context>): SelectRingAction<Context> {
    return new SelectRingAction<Context>(propertyFactory);
}
export function switchConflictElement<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<SwitchConflictElementProperties, Context> = {}): SwitchConflictElementAction<Context> {
    return new SwitchConflictElementAction<Context>(propertyFactory);
}
export function switchConflictType<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<SwitchConflictTypeProperties, Context> = {}): SwitchConflictTypeAction<Context> {
    return new SwitchConflictTypeAction<Context>(propertyFactory);
}
export function takeFateFromRing<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TakeFateRingProperties, Context> = {}): TakeFateFromRingAction<Context> {
    return new TakeFateFromRingAction<Context>(propertyFactory);
}
export function takeRing<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<TakeRingProperties, Context> = {}): TakeRingAction<Context> {
    return new TakeRingAction<Context>(propertyFactory);
}
export function claimRing<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ClaimRingProperties, Context>): ClaimRingAction<Context> {
    return new ClaimRingAction<Context>(propertyFactory);
}
export function removeRingFromPlay<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RemoveRingFromPlayProperties, Context> = {}): RemoveRingFromPlayAction<Context> {
    return new RemoveRingFromPlayAction<Context>(propertyFactory);
}
export function returnRingToPlay<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ReturnRingToPlayProperties, Context> = {}): ReturnRingToPlayAction<Context> {
    return new ReturnRingToPlayAction<Context>(propertyFactory);
}

export function discardStatusToken<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<DiscardStatusProperties, Context> = {}): DiscardStatusTokenAction<Context> {
    return new DiscardStatusTokenAction<Context>(propertyFactory);
}
export function moveStatusToken<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<MoveTokenProperties, Context>): MoveStatusTokenAction<Context> {
    return new MoveStatusTokenAction<Context>(propertyFactory);
}

export function cancel<Context extends CancellingContext = TriggeredAbilityContext>(propertyFactory: Derivable<CancelProperties, Context> = {}): CancelAction<Context> {
    return new CancelAction<Context>(propertyFactory);
}
export function handler<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<HandlerProperties<Context>, Context> = {}): HandlerAction<Context> {
    return new HandlerAction<Context>(propertyFactory);
}
/** A chat line as a step of its own: a `msg` template, or nothing; `targets` as for `handler()`. */
export function chatMessage<Context extends AbilityContext = AbilityContext>(message: (context: Context, targets: GameActionTarget[]) => MessageArgs | undefined): HandlerAction<Context> {
    return new HandlerAction<Context>({
        handler: (context, targets) => {
            const line = message(context, targets);
            if(line) {
                context.game.addMessage(line);
            }
        }
    });
}
export { noAction } from './HandlerAction.js';

export function conflictLastingEffect<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<LastingEffectProperties<Context>, Context>): LastingEffectAction<Context> {
    return new LastingEffectAction<Context>(propertyFactory);
}

export function duelLastingEffect<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<LastingEffectProperties<Context>, Context>): DuelLastingEffectAction<Context> {
    return new DuelLastingEffectAction<Context>(propertyFactory);
}

export function cardMenu<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<CardMenuProperties<Context>, Context>): CardMenuAction<Context> {
    return new CardMenuAction<Context>(propertyFactory);
}
export function chooseAction<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ChooseActionProperties<Context>, Context>): ChooseGameAction<Context> {
    return new ChooseGameAction<Context>(propertyFactory);
}
export function chooseAmount<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ChooseAmountProperties<Context>, Context>): ChooseAmountAction<Context> {
    return new ChooseAmountAction<Context>(propertyFactory);
}
export function conditional<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<ConditionalProperties<Context>, Context>): ConditionalAction<Context> {
    return new ConditionalAction<Context>(propertyFactory);
}
export function onAffinity<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<AffinityProperties<Context>, Context>): AffinityAction<Context> {
    return new AffinityAction<Context>(propertyFactory);
}
export function optional<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<OptionalProperties<Context>, Context>): OptionalAction<Context> {
    return new OptionalAction<Context>(propertyFactory);
}
export function ifAble<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<IfAbleProperties, Context>): IfAbleAction<Context> {
    return new IfAbleAction<Context>(propertyFactory);
}
export function joint<Context extends AbilityContext = AbilityContext>(gameActions: GameAction<GameActionProperties, EventName, Context>[]): JointGameAction<Context> {
    return new JointGameAction<Context>(gameActions);
}
export function multiple<Context extends AbilityContext = AbilityContext>(gameActions: GameActionList<Context>): MultipleGameAction<Context> {
    return new MultipleGameAction<Context>(gameActions);
}
/** The player puts the top cards of a deck (by default their own) back in the order they choose. */
export function rearrangeDeck<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<RearrangeDeckProperties<Context>, Context>): RearrangeDeckAction<Context> {
    return new RearrangeDeckAction<Context>(propertyFactory);
}
/** Two cards, two roles: the chooser gives each card one role, whose action then resolves on it. */
export function assignRoles<const Result extends string, Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<AssignRolesProperties<Result, Context>, Context>): AssignRolesAction<Context> {
    return new AssignRolesAction<Context>(propertyFactory);
}
export function selectCard<Context extends AbilityContext = AbilityContext, const Types extends CardTypes = CardTypes>(propertyFactory: Derivable<SelectCardProperties<Context, Types>, Context>): SelectCardAction<Context> {
    return new SelectCardAction<Context>(typeof propertyFactory === 'function'
        ? (context) => eraseSelectCardProperties(propertyFactory(context))
        : eraseSelectCardProperties(propertyFactory));
}
/** "Choose an attacked province": a selectCard limited to the conflict's provinces, without a prompt when there is only one. */
export function selectAttackedProvince<Context extends AbilityContext = AbilityContext>(
    propertyFactory: Derivable<AttackedProvinceProperties<Context>, Context>
): SelectCardAction<Context> {
    const withDefaults = (properties: AttackedProvinceProperties<Context>): SelectCardProperties<Context, CardType.Province> => {
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
    return selectCard<Context, CardType.Province>(typeof propertyFactory === 'function'
        ? (context) => withDefaults(propertyFactory(context))
        : withDefaults(propertyFactory));
}
export type AttackedProvinceProperties<Context extends AbilityContext = AbilityContext> = Omit<SelectCardProperties<Context, CardType.Province>, 'cardType' | 'location'>;
/** Several cards; `mode` says how many. */
export function selectCards<Context extends AbilityContext = AbilityContext, const Types extends CardTypes = CardTypes>(propertyFactory: Derivable<SelectCardsProperties<Context, Types> & { mode: MultiCardMode }, Context>): SelectCardAction<Context> {
    return new SelectCardAction<Context>(typeof propertyFactory === 'function'
        ? (context) => eraseSelectCardsProperties(propertyFactory(context))
        : eraseSelectCardsProperties(propertyFactory));
}
export function selectToken<Context extends AbilityContext = AbilityContext>(propertyFactory: Derivable<SelectTokenProperties<Context>, Context>): SelectTokenAction<Context> {
    return new SelectTokenAction<Context>(propertyFactory);
}
export function sequential<Context extends AbilityContext = AbilityContext>(gameActions: GameActionList<Context>): SequentialAction<Context> {
    return new SequentialAction<Context>(gameActions);
}

/** Each builder shortcut's properties, with its callbacks typed for the context `Context` of the ability being built. */
export interface ActionProps<Context extends AbilityContext> {
    addToken: AddTokenProperties;
    atEndOfConflict: AtEndOfConflictProperties<Context>;
    attach: AttachProperties;
    bow: BowProperties;
    cancel: CancelProperties;
    cardLastingEffect: LastingEffectCardProperties<Context>;
    cardMenu: CardMenuProperties<Context>;
    chooseAction: ChooseActionProperties<Context>;
    chooseAmount: ChooseAmountProperties<Context>;
    chosenDiscard: ChosenDiscardProperties<Context>;
    claimImperialFavor: ClaimFavorProperties;
    conflictLastingEffect: LastingEffectProperties<Context>;
    deckSearch: DeckSearchProperties<Context>;
    discardAtRandom: RandomDiscardProperties;
    discardCard: DiscardCardProperties;
    discardFromPlay: DiscardFromPlayProperties;
    discardStatusToken: DiscardStatusProperties;
    dishonor: DishonorProperties;
    draw: DrawProperties;
    duelLastingEffect: LastingEffectProperties<Context>;
    gainFate: GainFateProperties;
    gainHonor: GainHonorProperties;
    honor: HonorProperties;
    initiateConflict: InitiateConflictProperties;
    injure: InjureProperties;
    lookAt: LookAtProperties<Context>;
    loseFate: LoseFateProperties;
    loseHonor: LoseHonorProperties;
    modifyBid: ModifyBidProperties;
    moveCard: MoveCardProperties;
    moveToConflict: MoveToConflictProperties;
    optional: OptionalProperties<Context>;
    placeCardUnderneath: PlaceCardUnderneathProperties;
    placeFate: PlaceFateProperties;
    placeFateOnRing: PlaceFateRingProperties;
    playCard: PlayCardProperties;
    playerLastingEffect: PlayerLastingEffectInput<Context>;
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
    reveal: RevealProperties;
    ringLastingEffect: LastingEffectRingProperties<Context>;
    sacrifice: DiscardFromPlayProperties;
    selectAttackedProvince: AttackedProvinceProperties<Context>;
    selectRing: SelectRingProperties<Context>;
    selectToken: SelectTokenProperties<Context>;
    sendHome: SendHomeProperties;
    shuffleDeck: ShuffleDeckProperties;
    switchConflictType: SwitchConflictTypeProperties;
    taint: TaintProperties;
    takeFate: TransferFateProperties;
    takeHonor: TransferHonorProperties;
    tokenFromTopCard: TokenFromTopCardProperties;
}
