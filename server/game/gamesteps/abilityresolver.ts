import { BaseStepWithPipeline } from './BaseStepWithPipeline.js';
import { SimpleStep } from './SimpleStep.js';
import InitiateCardAbilityEvent from '../Events/InitiateCardAbilityEvent.js';
import InitiateAbilityEventWindow from '../Events/InitiateAbilityEventWindow.js';
import { Locations, Stages, CardTypes, EventNames } from '../Constants.js';
import type Game from '../Game.js';
import type { Event } from '../Events/Event.js';
import type BaseAbility from '../BaseAbility.js';
import type CardAbility from '../CardAbility.js';

type AbilityResolverTarget = Parameters<BaseAbility['resolveRemainingTargets']>[1];

interface AbilityResolverTargetResults {
    canIgnoreAllCosts?: boolean;
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

class AbilityResolver extends BaseStepWithPipeline {
    context: any;
    canCancel: boolean;
    initiateAbility: boolean;
    passPriority: boolean;
    events: Event[];
    provincesToRefill: unknown[];
    targetResults: AbilityResolverTargetResults;
    costResults: AbilityResolverCostResults;
    cancelled?: boolean;

    constructor(game: Game, context: any) {
        super(game);

        this.context = context;
        this.canCancel = true;
        this.initiateAbility = false;
        this.passPriority = false;
        this.events = [];
        this.provincesToRefill = [];
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
        if([CardTypes.Character, CardTypes.Holding, CardTypes.Attachment].includes(this.context.source.getType())) {
            this.context.cardStateWhenInitiated = this.context.source.createSnapshot();
        }
    }

    openInitiateAbilityEventWindow() {
        if(this.cancelled) {
            return;
        }
        let eventName = EventNames.OnAbilityResolverInitiated;
        let eventProps: Record<string, unknown> = {
            context: this.context
        };
        if(this.context.ability.isCardAbility()) {
            eventName = EventNames.OnCardAbilityInitiated;
            eventProps = {
                card: this.context.source,
                ability: this.context.ability,
                context: this.context
            };
            if(this.context.ability.isCardPlayed()) {
                this.events.push(this.game.getEvent(EventNames.OnCardPlayed, {
                    player: this.context.player,
                    card: this.context.source,
                    context: this.context,
                    originalLocation: this.context.source.location,
                    originallyOnTopOfConflictDeck: this.context.player && this.context.player.conflictDeck && this.context.player.conflictDeck[0] === this.context.source,
                    onPlayCardSource: this.context.onPlayCardSource,
                    playType: this.context.playType,
                    resolver: this
                }));
            }
            if(this.context.ability.isTriggeredAbility()) {
                this.events.push(this.game.getEvent(EventNames.OnCardAbilityTriggered, {
                    player: this.context.player,
                    card: this.context.source,
                    context: this.context
                }));
            }
        }
        this.events.push(this.game.getEvent(eventName, eventProps, () => this.queueInitiateAbilitySteps()));
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
        this.context.stage = Stages.PreTarget;
        if(!(this.context.ability as CardAbility).cannotTargetFirst) {
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
        this.context.stage = Stages.Cost;
        this.context.ability.resolveCosts(this.context, this.costResults);
    }

    getCostResults() {
        return {
            cancelled: false,
            canCancel: this.canCancel,
            events: [] as Event[],
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
        this.cancelled = this.costResults.events.some((event: Event) => event.getResolutionEvent().cancelled);
        if(this.cancelled) {
            this.game.addMessage('{0} attempted to use {1}, but did not successfully pay the required costs', this.context.player, this.context.source);
        }
    }

    resolveTargets() {
        if(this.cancelled) {
            return;
        }
        this.context.stage = Stages.Target;

        if(!this.context.ability.hasLegalTargets(this.context)) {
            // Ability cannot resolve, so display a message and cancel it
            this.game.addMessage('{0} attempted to use {1}, but there are insufficient legal targets', this.context.player, this.context.source);
            this.cancelled = true;
        } else if(this.targetResults.delayTargeting) {
            // Targeting was delayed due to an opponent needing to choose targets (which shouldn't happen until costs have been paid), so continue
            this.targetResults = this.context.ability.resolveRemainingTargets(this.context, this.targetResults.delayTargeting);
        } else if(this.targetResults.payCostsFirst || !this.context.ability.checkAllTargets(this.context)) {
            // Targeting was stopped by the player choosing to pay costs first, or one of the chosen targets is no longer legal. Retarget from scratch
            this.targetResults = this.context.ability.resolveTargets(this.context);
        }
    }

    initiateAbilityEffects() {
        if(this.cancelled) {
            for(const event of this.events) {
                event.cancel();
            }
            return;
        }

        if(this.context.ability.isCardPlayed()) {
            if(this.context.source.isLimited()) {
                this.context.player.limitedPlayed += 1;
            }
            if(this.game.currentConflict) {
                this.game.currentConflict.addCardPlayed(this.context.player, this.context.source);
            }
        }

        // Increment limits (limits aren't used up on cards in hand)
        const cardAbility = this.context.ability as CardAbility;
        if(cardAbility.limit && this.context.source.location !== Locations.Hand &&
           (!this.context.cardStateWhenInitiated || this.context.cardStateWhenInitiated.location === this.context.source.location)) {
            cardAbility.limit.increment(this.context.player);
        }
        if(cardAbility.max) {
            this.context.player.incrementAbilityMax(cardAbility.maxIdentifier);
        }
        this.context.ability.displayMessage(this.context);

        if(this.context.ability.isTriggeredAbility()) {
            // If this is an event, move it to 'being played', and queue a step to send it to the discard pile after it resolves
            if(this.context.ability.isCardPlayed()) {
                this.game.actions.moveCard({ destination: Locations.BeingPlayed }).resolve(this.context.source, this.context);
            }
            this.game.openThenEventWindow(new InitiateCardAbilityEvent({ card: this.context.source, context: this.context }, () => this.initiateAbility = true));
        } else {
            this.initiateAbility = true;
        }
    }

    executeHandler() {
        if(this.cancelled || !this.initiateAbility) {
            return;
        }
        this.context.stage = Stages.Effect;
        this.context.ability.executeHandler(this.context);
    }

    moveEventCardToDiscard() {
        if(this.context.source.location === Locations.BeingPlayed) {
            if(this.context.source.isDynasty) {
                this.context.player.moveCard(this.context.source, Locations.DynastyDiscardPile);
            } else {
                this.context.player.moveCard(this.context.source, Locations.ConflictDiscardPile);
            }
        }
    }

    refillProvinces() {
        this.context.refill();
    }
}

export default AbilityResolver;
