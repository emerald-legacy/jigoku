import { msg } from '../GameChat.js';
import { createCardPlayedEvent } from '../Events/cardPlayedEvent.js';
import { BaseStepWithPipeline } from './BaseStepWithPipeline.js';
import { SimpleStep } from './SimpleStep.js';
import { InitiateCardAbilityEvent } from '../Events/InitiateCardAbilityEvent.js';
import { InitiateAbilityEventWindow } from '../Events/InitiateAbilityEventWindow.js';
import { Location, Stage, CardType, EventName } from '../Constants.js';
import type Game from '../Game.js';
import type { Event } from '../Events/Event.js';
import type { BaseAbility } from '../BaseAbility.js';
import type { AbilityContext } from '../AbilityContext.js';
import { MoveCardAction } from '../GameActions/MoveCardAction.js';
import { canPayTargetingCosts, payTargetingCosts, type TargetingCost, targetingCosts } from '../GameActions/targetingCosts.js';

type AbilityResolverTarget = Parameters<BaseAbility['resolveRemainingTargets']>[1];

interface AbilityResolverTargetResults {
    cancelled?: boolean;
    payCostsFirst?: boolean;
    delayTargeting?: AbilityResolverTarget | null;
    playCosts?: boolean;
    triggerCosts?: boolean;
    events?: Event[];
    canCancel?: boolean;
}

interface AbilityResolverCostResults {
    cancelled: boolean;
    canCancel: boolean;
    events: Event[];
    playCosts: boolean;
    triggerCosts: boolean;
}

const snapshotTypes: readonly string[] = [CardType.Character, CardType.Holding, CardType.Attachment];

export class AbilityResolver extends BaseStepWithPipeline {
    context: AbilityContext;
    canCancel: boolean;
    initiateAbility: boolean;
    passPriority: boolean;
    events: Event[];
    targetResults: AbilityResolverTargetResults;
    costResults: AbilityResolverCostResults;
    cancelled?: boolean;

    constructor(game: Game, context: AbilityContext) {
        super(game);

        this.context = context;
        this.canCancel = true;
        this.initiateAbility = false;
        this.passPriority = false;
        this.events = [];
        this.targetResults = {};
        this.costResults = this.getCostResults();
        this.initialise();
    }

    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.createSnapshot()),
            new SimpleStep(this.game, () => this.resolveEarlyTargets()),
            new SimpleStep(this.game, () => this.checkForCancel()),
            new SimpleStep(this.game, () => this.openInitiateAbilityEventWindow()),
            new SimpleStep(this.game, () => this.refillProvinces())
        ]);
    }

    createSnapshot() {
        const source = this.context.source;
        if(snapshotTypes.includes(source.getType()) && source.isDrawCard()) {
            this.context.cardStateWhenInitiated = source.createSnapshot();
        }
    }

    openInitiateAbilityEventWindow() {
        if(this.cancelled) {
            return;
        }
        const initiate = () => this.queueInitiateAbilitySteps();
        const initiateEvent: Event = this.context.ability.isCardAbility() && !this.context.ability.isStep()
            ? this.game.getEvent(EventName.OnCardAbilityInitiated, {
                card: this.context.source,
                ability: this.context.ability,
                context: this.context
            }, initiate)
            : this.game.getEvent(EventName.OnAbilityResolverInitiated, { context: this.context }, initiate);
        if(this.context.ability.isCardAbility()) {
            const source = this.context.source;
            if(this.context.ability.isCardPlayed() && source.isDrawCard()) {
                this.events.push(createCardPlayedEvent(this.context, source, this.context.playType, this));
            }
            const ability = this.context.ability;
            if(ability.isTriggeredAbility() && ability.isCardAbilityInstance()) {
                this.events.push(this.game.getEvent(EventName.OnCardAbilityTriggered, {
                    player: this.context.player,
                    card: this.context.source,
                    ability,
                    context: this.context
                }));
            }
        }
        this.events.push(initiateEvent);
        this.game.queueStep(new InitiateAbilityEventWindow(this.game, this.events));
    }

    queueInitiateAbilitySteps() {
        this.queueStep(new SimpleStep(this.game, () => this.resolveCosts()));
        this.queueStep(new SimpleStep(this.game, () => this.payCosts()));
        this.queueStep(new SimpleStep(this.game, () => this.checkCostsWerePaid()));
        this.queueStep(new SimpleStep(this.game, () => this.resolveTargets()));
        this.queueStep(new SimpleStep(this.game, () => this.checkForCancel()));
        this.queueStep(new SimpleStep(this.game, () => this.initiateAbilityEffects()));
        this.queueStep(new SimpleStep(this.game, () => this.executeHandler()));
        this.queueStep(new SimpleStep(this.game, () => this.moveEventCardToDiscard()));
    }

    resolveEarlyTargets() {
        this.context.stage = Stage.PreTarget;
        if(!this.context.ability.cannotTargetFirst) {
            this.targetResults = this.context.ability.resolveTargets(this.context);
        }
    }

    checkForCancel() {
        if(this.cancelled) {
            return;
        }

        this.cancelled = this.targetResults.cancelled;
    }

    resolveCosts() {
        if(this.cancelled) {
            return;
        }
        this.costResults.canCancel = this.canCancel;
        this.context.stage = Stage.Cost;
        this.context.ability.resolveCosts(this.context, this.costResults);
    }

    getCostResults(): AbilityResolverCostResults {
        return {
            cancelled: false,
            canCancel: this.canCancel,
            events: [],
            playCosts: true,
            triggerCosts: true
        };
    }

    payCosts() {
        if(this.cancelled) {
            return;
        } else if(this.costResults.cancelled) {
            this.cancelled = true;
            return;
        }
        this.passPriority = true;
        if(this.costResults.events.length > 0) {
            this.game.openEventWindow(this.costResults.events);
        }
    }

    checkCostsWerePaid() {
        if(this.cancelled) {
            return;
        }
        if(this.costResults.events.some((event: Event) => event.getResolutionEvent().cancelled)) {
            this.stopForUnpaidCosts();
        }
    }

    /** The costs (or the costs of targeting) weren't paid: the ability stops, and a played event whose costs were paid in part goes to its discard pile. */
    protected stopForUnpaidCosts(): void {
        this.game.addMessage(msg`${this.context.player} attempted to use ${this.context.source}, but did not successfully pay the required costs`);
        this.cancelled = true;
        this.discardStoppedEvent();
        const playEvent = this.events.find((event) => event.is(EventName.OnCardPlayed));
        if(playEvent?.is(EventName.OnCardPlayed)) {
            this.game.emitEvent(EventName.OnCardPlayCostsNotPaid, { playEvent });
        }
        for(const event of this.events) {
            event.cancel();
        }
    }

    resolveTargets() {
        if(this.cancelled) {
            return;
        }
        this.context.stage = Stage.Target;

        if(!this.context.ability.hasLegalTargets(this.context)) {
            // a step without a legal target just doesn't resolve (RRG Target); only a use of the card is reported
            if(!this.context.ability.isStep()) {
                this.game.addMessage(msg`${this.context.player} attempted to use ${this.context.source}, but there are insufficient legal targets`);
            }
            this.discardStoppedEvent();
            this.cancelled = true;
        } else if(this.targetResults.delayTargeting) {
            // Targeting was delayed due to an opponent needing to choose targets (which shouldn't happen until costs have been paid), so continue
            this.targetResults = this.context.ability.resolveRemainingTargets(this.context, this.targetResults.delayTargeting);
        } else if(this.targetResults.payCostsFirst || !this.context.ability.checkAllTargets(this.context)) {
            // Targeting was stopped by the player choosing to pay costs first, or one of the chosen targets is no longer legal. Retarget from scratch
            this.targetResults = this.context.ability.resolveTargets(this.context);
        }
    }

    /** Whether the effects can initiate: the ability wasn't cancelled (else its events are), and the costs of targeting can be paid (else it stops). */
    protected canInitiateEffects(costsToTarget: TargetingCost[]): boolean {
        if(this.cancelled) {
            for(const event of this.events) {
                event.cancel();
            }
            return false;
        }
        if(!canPayTargetingCosts(this.context, costsToTarget)) {
            this.stopForUnpaidCosts();
            return false;
        }
        return true;
    }

    initiateAbilityEffects() {
        // paid with the costs, so cancelling the effects doesn't undo it
        const costsToTarget = targetingCosts(this.context, Object.values(this.context.targets).flat());
        if(!this.canInitiateEffects(costsToTarget)) {
            return;
        }

        const source = this.context.source;
        // a played card is always a draw card
        if(this.context.ability.isCardPlayed() && source.isDrawCard()) {
            if(source.isLimited()) {
                this.context.player.limitedPlayed += 1;
            }
            if(this.game.currentConflict) {
                this.game.currentConflict.addCardPlayed(this.context.player, source);
            }
        }

        // Increment limits (limits aren't used up on cards in hand)
        const { limit, max, maxIdentifier } = this.context.ability;
        if(limit && source.location !== Location.Hand &&
           (!this.context.cardStateWhenInitiated || this.context.cardStateWhenInitiated.location === source.location)) {
            limit.increment(this.context.player);
        }
        if(max && maxIdentifier !== undefined) {
            this.context.player.incrementAbilityMax(maxIdentifier);
        }
        this.context.ability.displayMessage(this.context);
        payTargetingCosts(this.context, costsToTarget);

        if(this.context.ability.isTriggeredAbility()) {
            // If this is an event, move it to 'being played', and queue a step to send it to the discard pile after it resolves
            if(this.context.ability.isCardPlayed()) {
                new MoveCardAction({ destination: Location.BeingPlayed }).resolve(this.context.source, this.context);
            }
            this.game.openThenEventWindow(new InitiateCardAbilityEvent({ card: this.context.source, context: this.context }, () => this.initiateAbility = true));
        } else {
            // a step has no initiate event: "Then, choose …" targets count for the triggering too
            this.context.recordChosenCardTargets(Object.values(this.context.targets).flat());
            this.initiateAbility = true;
        }
    }

    executeHandler() {
        if(this.cancelled || !this.initiateAbility) {
            return;
        }
        this.context.stage = Stage.Effect;
        this.context.ability.executeHandler(this.context);
    }

    /** RRG Event: an event whose costs were (partially) paid still goes to its discard pile when it stops. */
    private discardStoppedEvent() {
        const source = this.context.source;
        if(this.context.ability.isCardPlayed() && source.type === CardType.Event && source.location === Location.Hand && this.costResults.events.length > 0) {
            this.context.player.moveCard(source, source.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile);
        }
    }

    moveEventCardToDiscard() {
        if(this.context.source.location === Location.BeingPlayed) {
            if(this.context.source.isDynasty) {
                this.context.player.moveCard(this.context.source, Location.DynastyDiscardPile);
            } else {
                this.context.player.moveCard(this.context.source, Location.ConflictDiscardPile);
            }
        }
    }

    refillProvinces() {
        this.context.refill();
    }
}

