import type { MsgArg } from './GameChat.js';
import { AbilityContext } from './AbilityContext.js';
import BaseCardAbility from './BaseCardAbility.js';
import type { BaseAbilityProperties } from './BaseAbility.js';
import type BaseCard from './BaseCard.js';
import type { GameAction } from './GameActions/GameAction.js';
import type { Event } from './Events/Event.js';
import type EventWindow from './Events/EventWindow.js';
import type ThenEventWindow from './Events/ThenEventWindow.js';
import type { EffectArg } from './Interfaces.js';

export interface ThenAbilityProperties<C extends AbilityContext = AbilityContext> extends BaseAbilityProperties {
    handler?: (context: C) => void;
    then?: ThenAbilityProperties | ((context: C) => ThenAbilityProperties);
    // called with the context on the immediate path, with an Event via EventWindow.addThenAbility
    thenCondition?(contextOrEvent: C | Event): boolean;
    message?: string | ((context: C) => string);
    messageArgs?: (EffectArg | undefined)[] | ((context: C) => (EffectArg | undefined)[]);
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
            const thenAbility = new ThenAbility(this.card, then);
            return thenAbility.meetsRequirements(thenAbility.createContext(context.player)) === '';
        }
        return false;
    }

    displayMessage(context: AbilityContext): void {
        let message = this.properties.message;
        if(typeof message === 'function') {
            message = message(context);
        }
        if(message) {
            let messageArgs: MsgArg[] = [context.player, context.source, context.target];
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
        if(then && typeof then === 'function') {
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
                    window.addThenAbility(new ThenAbility(this.card, then), context, (then).thenCondition);
                }
            } else if(then && (then).thenCondition && (then).thenCondition?.(context)) {
                const thenAbility = new ThenAbility(this.card, then);
                const thenContext = thenAbility.createContext(context.player);
                // a `then` continues the same triggering, so keep the link for chosenCardTargets
                thenContext.originatingContext = context.triggeringContext;
                this.game.resolveAbility(thenContext);
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
