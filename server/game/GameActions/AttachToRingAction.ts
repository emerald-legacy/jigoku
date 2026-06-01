import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventNames, Locations } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Ring from '../Ring.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export interface AttachToRingActionProperties extends CardActionProperties {
    attachment?: DrawCard;
}

export class AttachToRingAction extends CardGameAction<AttachToRingActionProperties> {
    name = 'attachToRing';
    eventName = EventNames.OnCardAttached;
    targetType = ['ring'];

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context);
        return ['attach {1} to {0}', [properties.target, properties.attachment]];
    }

    canAffect(ring: Ring, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        if(!context || !context.player || !ring) {
            return false;
        } else if(
            !properties.attachment ||
            properties.attachment.anotherUniqueInPlay(context.player) ||
            !properties.attachment.canAttach(ring)
        ) {
            return false;
        }
        return super.canAffect(ring, context);
    }

    checkEventCondition(event: Event, additionalProperties: Record<string, unknown> = {}): boolean {
        return this.canAffect(event.parent, event.context as AbilityContext, additionalProperties);
    }

    isEventFullyResolved(event: Event, card: BaseCard | Ring, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): boolean {
        let { attachment } = this.getProperties(context, additionalProperties);
        return event.parent === card && event.card === attachment && event.name === this.eventName && !event.cancelled;
    }

    addPropertiesToEvent(event: Event, card: BaseCard | Ring, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { attachment } = this.getProperties(context, additionalProperties);
        event.name = this.eventName;
        event.parent = card;
        event.card = attachment;
        event.context = context;
    }

    eventHandler(event: Event): void {
        if(event.card.location === Locations.PlayArea && event.card.parent) {
            event.card.parent.removeAttachment(event.card);
        } else {
            event.card.controller.removeCardFromPile(event.card);
            event.card.new = true;
            event.card.moveTo(Locations.PlayArea);
        }
        event.card.untaint();
        event.card.makeOrdinary();
        event.card.bowed = false;
        event.card.covert = false;
        event.card.fate = 0;

        const context = event.context as AbilityContext;
        event.parent.attachments.push(event.card);
        event.card.parent = event.parent;
        if(event.card.controller !== context.player) {
            event.card.controller = context.player;
            event.card.updateEffectContexts();
        }
    }
}
