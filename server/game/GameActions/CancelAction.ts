import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import { CardType, EventName, RestrictionType } from '../Constants.js';
import type { GameObject } from '../GameObject.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { AnyEvent, TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import { GameAction, type GameActionProperties, type ActionEvent } from './GameAction.js';

export interface CancelProperties extends GameActionProperties {
    replacementGameAction?: GameAction;
    chatText?: string;
}

export type CancellingContext = AbilityContext & { event?: AnyEvent; cancel(): void };

export class CancelAction<C extends CancellingContext = TriggeredAbilityContext> extends GameAction<CancelProperties, EventName.Unnamed, C> {
    protected effectMessage(context: C): MessageArgs {
        const { replacementGameAction, chatText } = this.getProperties(context);
        if(chatText) {
            return [chatText, []];
        }
        if(replacementGameAction) {
            return ['{1} {0} instead of {2}', [replacementGameAction.name, context.event?.card]];
        }
        return ['cancel the effects of {0}', []];
    }

    protected effectMessageTarget(context: C): MsgArg {
        const { replacementGameAction, chatText } = this.getProperties(context);
        if(chatText) {
            return undefined;
        }
        return replacementGameAction ? context.target : context.event?.card;
    }

    getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        const properties = super.getProperties(context, additionalProperties);
        if(properties.replacementGameAction) {
            properties.replacementGameAction.setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        if(!context.event || context.event.cancelled) {
            return false;
        }
        const { replacementGameAction } = this.getProperties(context);
        let cannotBeCancelled = context.event.cannotBeCancelled;
        if(
            context.event.card &&
            context.event.card.getType() === CardType.Event &&
            context.event.card.owner.eventsCannotBeCancelled()
        ) {
            cannotBeCancelled = true;
        }
        if(
            context.event.name === EventName.OnCardLeavesPlay &&
            context.event.card &&
            !context.event.card.checkRestrictions(RestrictionType.PreventedFromLeavingPlay, context)
        ) {
            cannotBeCancelled = true;
        }

        return (
            !cannotBeCancelled &&
            (!replacementGameAction || replacementGameAction.hasLegalTarget(context, additionalProperties))
        );
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const event = this.createEvent(null, context, additionalProperties);
        super.addPropertiesToEvent(event, null, context, additionalProperties);
        event.replaceHandler(() => this.eventHandler(event, additionalProperties));
        events.push(event);
    }

    eventHandler(event: ActionEvent<EventName, C>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const cancelled = context.event;
        if(!cancelled) {
            return;
        }
        const { replacementGameAction } = this.getProperties(context, additionalProperties);
        if(replacementGameAction) {
            const events: Event[] = [];
            const eventWindow = cancelled.window;
            replacementGameAction.addEventsToArray(
                events,
                context,
                Object.assign({ replacementEffect: true }, additionalProperties)
            );
            context.game.queueSimpleStep(() => {
                if(!cancelled.isSacrifice && events.length === 1) {
                    cancelled.replacementEvent = events[0];
                }
                for(const newEvent of events) {
                    eventWindow?.addEvent(newEvent);
                }
            });
        }
        context.cancel();
    }

    canAffect(target: GameObject, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { replacementGameAction } = this.getProperties(context, additionalProperties);
        if(!replacementGameAction) {
            return !!context.event && !context.event.cannotBeCancelled;
        }
        return replacementGameAction.canAffect(target, context, additionalProperties);
    }

    defaultTargets(context: C): GameObject[] {
        return context.event?.card ? [context.event.card] : [];
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { replacementGameAction } = this.getProperties(context);
        return (
            replacementGameAction !== undefined &&
            replacementGameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties)
        );
    }
}
