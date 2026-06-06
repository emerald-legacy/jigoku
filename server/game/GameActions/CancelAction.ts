import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type EventWindow from '../Events/EventWindow.js';
import { CardType, EventName } from '../Constants.js';
import type { GameObject } from '../GameObject.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

export interface CancelActionProperties extends GameActionProperties {
    replacementGameAction?: GameAction;
    effect?: string;
}

export class CancelAction extends GameAction {
    getEffectMessage(context: TriggeredAbilityContext): MessageArgs {
        let { replacementGameAction, effect } = this.getProperties(context);
        if(effect) {
            return [effect, []];
        }
        if(replacementGameAction) {
            return ['{1} {0} instead of {2}', [context.target, replacementGameAction.name, context.event.card]];
        }
        return ['cancel the effects of {0}', [context.event.card]];
    }

    getProperties(context: TriggeredAbilityContext, additionalProperties = {}): CancelActionProperties {
        let properties = super.getProperties(context, additionalProperties) as CancelActionProperties;
        if(properties.replacementGameAction) {
            properties.replacementGameAction.setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: TriggeredAbilityContext, additionalProperties = {}): boolean {
        if(!context.event || context.event.cancelled) {
            return false;
        }
        let { replacementGameAction } = this.getProperties(context);
        let cannotBeCancelled = context.event.cannotBeCancelled;
        if(
            context.event.card &&
            typeof context.event.card.getType === 'function' &&
            context.event.card.getType() === CardType.Event &&
            context.event.card.owner &&
            context.event.card.owner.eventsCannotBeCancelled()
        ) {
            cannotBeCancelled = true;
        }
        if(
            context.event.name === EventName.OnCardLeavesPlay &&
            context.event.card &&
            !context.event.card.checkRestrictions('preventedFromLeavingPlay', context)
        ) {
            cannotBeCancelled = true;
        }

        return (
            !cannotBeCancelled &&
            (!replacementGameAction || replacementGameAction.hasLegalTarget(context, additionalProperties))
        );
    }

    addEventsToArray(events: Event[], context: TriggeredAbilityContext, additionalProperties = {}): void {
        let event = this.createEvent(null, context, additionalProperties);
        super.addPropertiesToEvent(event, null, context, additionalProperties);
        event.replaceHandler((event: Event) => this.eventHandler(event, additionalProperties));
        events.push(event);
    }

    eventHandler(event: Event, additionalProperties = {}): void {
        const context = event.context as TriggeredAbilityContext;
        let { replacementGameAction } = this.getProperties(context, additionalProperties);
        if(replacementGameAction) {
            let events: Event[] = [];
            let eventWindow = context.event.window as EventWindow;
            replacementGameAction.addEventsToArray(
                events,
                context,
                Object.assign({ replacementEffect: true }, additionalProperties)
            );
            context.game.queueSimpleStep(() => {
                if(!context.event.isSacrifice && events.length === 1) {
                    context.event.replacementEvent = events[0];
                }
                for(let newEvent of events) {
                    eventWindow.addEvent(newEvent);
                }
            });
        }
        context.cancel();
    }

    canAffect(target: GameObject, context: TriggeredAbilityContext, additionalProperties = {}): boolean {
        let { replacementGameAction } = this.getProperties(context, additionalProperties);
        if(!replacementGameAction) {
            return !context.event.cannotBeCancelled;
        }
        return replacementGameAction.canAffect(target, context, additionalProperties);
    }

    defaultTargets(context: TriggeredAbilityContext): GameObject[] {
        return context.event.card ? [context.event.card] : [];
    }

    hasTargetsChosenByInitiatingPlayer(context: TriggeredAbilityContext, additionalProperties = {}): boolean {
        let { replacementGameAction } = this.getProperties(context);
        return (
            replacementGameAction !== undefined &&
            replacementGameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties)
        );
    }
}
