import type { MessageArgs, MsgArg } from './GameChat.js';
import { AbilityContext } from './AbilityContext.js';
import BaseCardAbility from './BaseCardAbility.js';
import type { BaseAbilityProperties, DeclaredGameAction } from './BaseAbility.js';
import type BaseCard from './BaseCard.js';
import type { GameAction } from './GameActions/GameAction.js';
import type { Event } from './Events/Event.js';
import type EventWindow from './Events/EventWindow.js';
import type ThenEventWindow from './Events/ThenEventWindow.js';
import type { EffectArg, OwnContextCallback } from './Interfaces.js';

export interface ThenAbilityProperties<C extends AbilityContext = AbilityContext> extends BaseAbilityProperties {
    gameAction?: DeclaredGameAction<C> | DeclaredGameAction<C>[];
    handler?: OwnContextCallback<[context: C], void>;
    then?: ThenAbilityProperties | OwnContextCallback<[context: C], ThenAbilityProperties | undefined>;
    // called with the context on the immediate path, with an Event via EventWindow.addThenAbility
    thenCondition?(contextOrEvent: C | Event): boolean;
    /** A format with `{0}` the player, `{1}` the source and `{2}` the target, or a `msg` template. */
    message?: string | OwnContextCallback<[context: C], string | MessageArgs>;
    messageArgs?: (EffectArg | undefined)[] | OwnContextCallback<[context: C], (EffectArg | undefined)[]>;
    /** Its context starts with the chosen targets, selects and costs of the ability it continues. */
    inheritTargets?: boolean;
}

class ThenAbility extends BaseCardAbility {
    properties: ThenAbilityProperties;
    handler: (context: AbilityContext) => void;
    cannotTargetFirst = true;

    constructor(card: BaseCard, properties: ThenAbilityProperties) {
        super(card, properties);

        this.properties = properties;
        this.handler = properties.handler || this.executeGameActions.bind(this);
    }

    checkGameActionsForPotential(context: AbilityContext): boolean {
        if(super.checkGameActionsForPotential(context)) {
            return true;
        } else if(this.gameAction.every((gameAction) => gameAction.isOptional(context)) && this.properties.then) {
            const then =
                typeof this.properties.then === 'function' ? this.properties.then(context) : this.properties.then;
            if(!then) {
                return false;
            }
            const thenAbility = new ThenAbility(this.card, then);
            return thenAbility.meetsRequirements(thenAbility.createThenContext(context)) === '';
        }
        return false;
    }

    /** The context of this `then`, continuing `parent`. */
    createThenContext(parent: AbilityContext): AbilityContext {
        const context = this.createContext(parent.player);
        // a `then` continues the same triggering, so keep the link for chosenCardTargets
        context.originatingContext = parent.triggeringContext;
        if(this.properties.inheritTargets) {
            context.targets = { ...parent.targets };
            context.selects = { ...parent.selects };
            context.rings = { ...parent.rings };
            context.tokens = { ...parent.tokens };
            context.costs = { ...parent.costs };
            context.target = parent.target;
            context.select = parent.select;
            context.ring = parent.ring;
            context.token = parent.token;
        }
        return context;
    }

    displayMessage(context: AbilityContext): void {
        const property = this.properties.message;
        const message = typeof property === 'function' ? property(context) : property;
        if(Array.isArray(message)) {
            this.game.addMessage(message[0], ...message[1]);
        } else if(message) {
            let messageArgs: MsgArg[] = [context.player, context.source, context.messageTarget()];
            if(this.properties.messageArgs) {
                let args = this.properties.messageArgs;
                if(typeof args === 'function') {
                    args = args(context);
                }
                messageArgs = messageArgs.concat(args);
            }
            this.game.addMessage(message, ...messageArgs);
        }
    }

    getGameActions(context: AbilityContext): GameAction[] {
        // if there are any targets, look for gameActions attached to them
        const actions = this.targets.flatMap((target) => target.getGameAction(context));
        // look for a gameAction on the ability itself, on an attachment execute that action on its parent, otherwise on the card itself
        return actions.concat(this.gameAction);
    }

    executeHandler(context: AbilityContext): void {
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
        for(const action of actions) {
            this.game.queueSimpleStep(() => {
                action.addEventsToArray(context.events, context);
            });
        }
        this.game.queueSimpleStep(() => {
            const eventsToResolve = context.events.filter((event) => !event.cancelled && !event.resolved);
            if(eventsToResolve.length > 0) {
                const window = this.openEventWindow(eventsToResolve);
                if(then) {
                    window.addThenAbility(new ThenAbility(this.card, then), context, then.thenCondition);
                }
            } else if(then?.thenCondition?.(context)) {
                this.game.resolveAbility(new ThenAbility(this.card, then).createThenContext(context));
            }
        });
    }

    openEventWindow(events: Event[]): EventWindow | ThenEventWindow {
        return this.game.openThenEventWindow(events);
    }

    isCardAbility(): boolean {
        return true;
    }
}

export default ThenAbility;
