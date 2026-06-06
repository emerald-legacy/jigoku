import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName, Location } from '../Constants.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type DrawCard from '../DrawCard.js';
import type Ring from '../Ring.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export interface AttachToRingActionProperties extends CardActionProperties {
    attachment?: DrawCard;
}

export class AttachToRingAction extends CardGameAction<AttachToRingActionProperties> {
    name = 'attachToRing';
    eventName = EventName.OnCardAttached;
    targetType = ['ring'];

    getEffectMessage(context: AbilityContext): MessageArgs {
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

    checkEventCondition(event: GameEvent<EventName.OnCardAttached>, additionalProperties: Record<string, unknown> = {}): boolean {
        return this.canAffect(event.parent as Ring, event.context as AbilityContext, additionalProperties);
    }

    isEventFullyResolved(event: GameEvent<EventName.OnCardAttached>, card: BaseCard | Ring, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): boolean {
        let { attachment } = this.getProperties(context, additionalProperties);
        return event.parent === card && event.card === attachment && event.name === this.eventName && !event.cancelled;
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnCardAttached>, card: BaseCard | Ring, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { attachment } = this.getProperties(context, additionalProperties);
        event.name = this.eventName;
        event.parent = card as Ring;
        event.card = attachment as DrawCard;
        event.context = context;
    }

    eventHandler(event: GameEvent<EventName.OnCardAttached>): void {
        const card = event.card as DrawCard;
        if(card.location === Location.PlayArea && card.parent) {
            card.parent.removeAttachment(card);
        } else {
            card.controller.removeCardFromPile(card);
            card.new = true;
            card.moveTo(Location.PlayArea);
        }
        card.untaint();
        card.makeOrdinary();
        card.bowed = false;
        card.covert = false;
        card.fate = 0;

        const context = event.context as AbilityContext;
        event.parent.attachments.push(card);
        card.parent = event.parent as DrawCard;
        if(card.controller !== context.player) {
            card.controller = context.player;
            card.updateEffectContexts();
        }
    }
}
