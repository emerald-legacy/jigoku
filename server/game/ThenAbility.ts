import { Blocker } from './Constants.js';
import type { MessageArgs } from './GameChat.js';
import type { AbilityContext } from './AbilityContext.js';
import { BaseCardAbility } from './BaseCardAbility.js';
import type { BaseAbilityProperties, DeclaredGameAction } from './BaseAbility.js';
import type BaseCard from './BaseCard.js';
import type { HeldAction } from './GameActions/GameAction.js';
import type { Event } from './Events/Event.js';
import type { EventWindow } from './Events/EventWindow.js';
import type { ThenEventWindow } from './Events/ThenEventWindow.js';
import type { OwnContextCallback } from './Interfaces.js';

export interface ThenAbilityProperties<Context extends AbilityContext = AbilityContext> extends BaseAbilityProperties {
    gameAction?: DeclaredGameAction<Context> | DeclaredGameAction<Context>[];
    handler?: OwnContextCallback<[context: Context], void>;
    /** Runs when the ability starts resolving, before its handler or game actions. */
    onResolve?: OwnContextCallback<[context: Context], void>;
    then?: ThenAbilityProperties | OwnContextCallback<[context: Context], ThenAbilityProperties | undefined>;
    // called with the context on the immediate path, with an Event via EventWindow.addThenAbility
    thenCondition?(contextOrEvent: Context | Event): boolean;
    /** The step's whole chat line; nothing when it returns undefined. */
    message?: OwnContextCallback<[context: Context], MessageArgs | undefined>;
    /** Its context starts with the chosen targets, selects and costs of the ability it continues, and that ability's events as `previousEvents`. */
    inheritTargets?: boolean;
}

export class ThenAbility extends BaseCardAbility {
    properties: ThenAbilityProperties;
    handler: (context: AbilityContext) => void;
    override cannotTargetFirst = true;

    constructor(card: BaseCard, properties: ThenAbilityProperties) {
        super(card, properties);

        this.properties = properties;
        this.handler = properties.handler || this.executeGameActions.bind(this);
    }

    override checkGameActionsForPotential(context: AbilityContext): boolean {
        if(super.checkGameActionsForPotential(context)) {
            return true;
        } else if(this.gameAction.every((gameAction) => gameAction.isOptional(context)) && this.properties.then) {
            const then =
                typeof this.properties.then === 'function' ? this.properties.then(context) : this.properties.then;
            if(!then) {
                return false;
            }
            const thenAbility = new ThenAbility(this.card, then);
            return thenAbility.meetsRequirements(thenAbility.createThenContext(context)) === Blocker.None;
        }
        return false;
    }

    /** Also the targets of a following step ("Then, choose …"), which Hantei XXXVIII chooses too (ruling #926). */
    override hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        if(super.hasTargetsChosenByInitiatingPlayer(context)) {
            return true;
        }
        const then = this.properties.then;
        if(!then || typeof then === 'function') {
            return false;
        }
        const thenAbility = new ThenAbility(this.card, then);
        return thenAbility.hasTargetsChosenByInitiatingPlayer(thenAbility.createThenContext(context));
    }

    /** The context of this `then`, continuing `parent`. */
    createThenContext(parent: AbilityContext): AbilityContext {
        const context = this.createContext(parent.player);
        // a `then` continues the same triggering, so keep the link for chosenCardTargets
        context.originatingContext = parent.triggeringContext;
        // whoever chooses the targets instead (Hantei XXXVIII) chooses them in every step
        context.choosingPlayerOverride = parent.choosingPlayerOverride;
        if(this.properties.inheritTargets) {
            context.targets = { ...parent.targets };
            context.selects = { ...parent.selects };
            context.rings = { ...parent.rings };
            context.tokens = { ...parent.tokens };
            context.costs = { ...parent.costs };
            context.targetingCostPaid = parent.targetingCostPaid;
            context.target = parent.target;
            context.select = parent.select;
            context.ring = parent.ring;
            context.token = parent.token;
            context.previousEvents = [...parent.events];
            context.deckSearchSelected = parent.deckSearchSelected;
        }
        return context;
    }

    override displayMessage(context: AbilityContext): void {
        const message = this.properties.message?.(context);
        if(message) {
            this.game.addMessage(message);
        }
    }

    getGameActions(context: AbilityContext): HeldAction[] {
        // if there are any targets, look for gameActions attached to them
        const actions = this.targets.flatMap((target) => target.getGameAction(context));
        // look for a gameAction on the ability itself, on an attachment execute that action on its parent, otherwise on the card itself
        return actions.concat(this.gameAction.map((action) => ({ action, overrides: {} })));
    }

    override executeHandler(context: AbilityContext): void {
        this.properties.onResolve?.(context);
        this.handler(context);
        this.game.queueSimpleStep(() => this.game.checkGameState());
    }

    executeGameActions(context: AbilityContext): void {
        context.events = [];
        const actions = this.getGameActions(context);
        let then = this.properties.then;
        if(typeof then === 'function') {
            then = then(context);
        }
        for(const { action, overrides } of actions) {
            this.game.queueSimpleStep(() => {
                action.addEventsToArray(context.events, context, overrides);
            });
        }
        this.game.queueSimpleStep(() => {
            const eventsToResolve = context.events.filter((event) => !event.cancelled && !event.resolved);
            if(eventsToResolve.length > 0) {
                const window = this.openEventWindow(eventsToResolve);
                if(then) {
                    window.addThenAbility(new ThenAbility(this.card, then), context, then.thenCondition);
                }
            } else if(then && this.followsResolvedEvents(context, then)) {
                this.game.resolveAbility(new ThenAbility(this.card, then).createThenContext(context));
            }
        });
    }

    /** Whether `then` follows when this step's events already resolved (e.g. in a `sequential`), as an event window decides. */
    private followsResolvedEvents(context: AbilityContext, then: ThenAbilityProperties): boolean {
        if(context.events.length === 0) {
            return !!then.thenCondition?.(context);
        }
        const condition = then.thenCondition ?? ((event: Event) => event.isFullyResolved());
        return context.events.every((event) => condition(event));
    }

    openEventWindow(events: Event[]): EventWindow | ThenEventWindow {
        return this.game.openThenEventWindow(events);
    }

    override isCardAbility(): boolean {
        return true;
    }

    override isStep(): boolean {
        return true;
    }
}

