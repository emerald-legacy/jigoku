import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import { CardType, EventName, RestrictionType } from '../Constants.js';
import type { GameObject } from '../GameObject.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { AnyEvent, TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import { GameAction, type GameActionProperties, type ActionEvent } from './GameAction.js';
import { ResolvableAbility } from '../ResolvableAbility.js';

export interface CancelProperties extends GameActionProperties {
    replacementGameAction?: GameAction;
    /** "Instead, X. Then, Y": resolves once the replacement has fully resolved. */
    thenGameAction?: GameAction;
}

export type CancellingContext = AbilityContext & { event?: AnyEvent; cancel(): void };

export class CancelAction<Context extends CancellingContext = TriggeredAbilityContext> extends GameAction<CancelProperties, EventName.Unnamed, Context> {
    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { replacementGameAction } = this.getProperties(context, additionalProperties);
        if(replacementGameAction) {
            // the replacement's target is this action's, so its `{0}` stays ours
            const [format, [, ...args]] = replacementGameAction.getEffectMessage(context, this.#replacementOverrides(context));
            return [`${format} instead of {${args.length + 1}}`, [...args, context.event?.card]];
        }
        return ['cancel the effects of {0}', []];
    }

    protected override effectMessageTarget(context: Context, additionalProperties: ActionOverrides = {}): MsgArg {
        const { replacementGameAction } = this.getProperties(context, additionalProperties);
        return replacementGameAction ? context.target : context.event?.card;
    }

    #replacementOverrides(context: Context, additionalProperties: ActionOverrides = {}): ActionOverrides {
        return { ...additionalProperties, target: this.getProperties(context, additionalProperties).target };
    }

    override hasLegalTarget(context: Context, additionalProperties: ActionOverrides = {}): boolean {
        if(!context.event || context.event.cancelled) {
            return false;
        }
        const { replacementGameAction } = this.getProperties(context, additionalProperties);
        let cannotBeCancelled = context.event.cannotBeCancelled;
        if(
            context.event.card &&
            context.event.card.getType() === CardType.Event &&
            context.event.card.controller.eventsCannotBeCancelled()
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
            (!replacementGameAction || replacementGameAction.hasLegalTarget(context, this.#replacementOverrides(context, additionalProperties)))
        );
    }

    override addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
        const event = this.createEvent(null, context, additionalProperties);
        super.addPropertiesToEvent(event, null, context, additionalProperties);
        event.replaceHandler(() => this.eventHandler(event, additionalProperties));
        events.push(event);
    }

    override eventHandler(event: ActionEvent<EventName, Context>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const cancelled = context.event;
        if(!cancelled) {
            return;
        }
        const { replacementGameAction, thenGameAction } = this.getProperties(context, additionalProperties);
        if(replacementGameAction) {
            const events: Event[] = [];
            const eventWindow = cancelled.window;
            replacementGameAction.addEventsToArray(
                events,
                context,
                Object.assign({ replacementEffect: true }, this.#replacementOverrides(context, additionalProperties))
            );
            context.game.queueSimpleStep(() => {
                if(!cancelled.isSacrifice && events.length === 1) {
                    cancelled.replacementEvent = events[0];
                }
                for(const newEvent of events) {
                    eventWindow?.addEvent(newEvent);
                }
                if(thenGameAction && eventWindow && events.length > 0) {
                    const thenContext = context.copy({});
                    thenContext.events = events;
                    eventWindow.addThenAbility(new ResolvableAbility(context.source, { gameAction: thenGameAction }), thenContext);
                }
            });
        }
        context.cancel();
    }

    override canAffect(target: GameObject, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { replacementGameAction } = this.getProperties(context, additionalProperties);
        if(!replacementGameAction) {
            return !!context.event && !context.event.cannotBeCancelled;
        }
        return replacementGameAction.canAffect(target, context, this.#replacementOverrides(context, additionalProperties));
    }

    override defaultTargets(context: Context): GameObject[] {
        return context.event?.card ? [context.event.card] : [];
    }

    override hasTargetsChosenByInitiatingPlayer(context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { replacementGameAction } = this.getProperties(context, additionalProperties);
        return (
            replacementGameAction !== undefined &&
            replacementGameAction.hasTargetsChosenByInitiatingPlayer(context, this.#replacementOverrides(context, additionalProperties))
        );
    }
}
