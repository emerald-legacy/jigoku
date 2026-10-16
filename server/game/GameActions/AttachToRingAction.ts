import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import Ring from '../Ring.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';

export interface AttachToRingProperties extends CardActionProperties {
    attachment?: DrawCard;
}

export class AttachToRingAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<AttachToRingProperties, EventName.OnCardAttached, Context> {
    override name = 'attachToRing';
    override eventName = EventName.OnCardAttached;
    override targetType = ['ring'];

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        return ['attach {1} to {0}', [this.getProperties(context, additionalProperties).attachment]];
    }

    override canAffect(ring: Ring, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        if(!context.player) {
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

    override checkEventCondition(event: ActionEvent<EventName.OnCardAttached, Context>, additionalProperties: ActionOverrides = {}): boolean {
        const parent = event.parent;
        return parent instanceof Ring && this.canAffect(parent, event.context, additionalProperties);
    }

    override isEventFullyResolved(event: AnyEvent, card: BaseCard | Ring, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { attachment } = this.getProperties(context, additionalProperties);
        return event.parent === card && event.card === attachment && event.name === this.eventName && !event.cancelled;
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnCardAttached, Context>, ring: BaseCard | Ring, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { attachment } = this.getProperties(context, additionalProperties);
        event.parent = ring;
        if(attachment) {
            event.card = attachment;
        }
        event.context = context;
    }

    override eventHandler(event: ActionEvent<EventName.OnCardAttached, Context>): void {
        const card = event.card;
        if(card.location === Location.PlayArea && card.parent) {
            card.parent.removeAttachment(card);
        } else {
            if(card.location === Location.PlayArea) {
                event.context.game.currentConflict?.removeFromConflict(card);
            }
            card.controller.removeCardFromPile(card);
            card.new = true;
            card.moveTo(Location.PlayArea);
        }
        card.untaint();
        card.makeOrdinary();
        card.bowed = false;
        card.covert = false;
        card.fate = 0;

        const context = event.context;
        event.parent.attachments.push(card);
        card.parent = event.parent;
        if(card.controller !== context.player) {
            card.controller = context.player;
            card.updateEffectContexts();
        }
    }
}
