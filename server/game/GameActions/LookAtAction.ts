import type { ActionOverrides } from './GameAction.js';
import { msg, type MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName, Location } from '../Constants.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import { targetList, type ActionEvent } from './GameAction.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';

export interface LookAtProperties<Context extends AbilityContext = AbilityContext> extends CardActionProperties {
    message?(context: Context, cards: BaseCard[]): MessageArgs;
}

export class LookAtAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<LookAtProperties, EventName.OnLookAtCards, Context, 'message'> {
    override name = 'lookAt';
    override eventName = EventName.OnLookAtCards;
    override effect = 'look at a facedown card';
    override defaultProperties = {
        message: (context: AbilityContext, cards: BaseCard[]) => msg`${context.source} sees ${cards}`
    };

    override canAffect(card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}) {
        if(!card.isFacedown() && (card.isInProvince() || card.location === Location.PlayArea)) {
            return false;
        }
        return super.canAffect(card, context, additionalProperties);
    }

    override addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
        const { target } = this.getProperties(context, additionalProperties);
        const cards = targetList(target).filter((card) => this.canAffect(card, context, additionalProperties));
        if(cards.length === 0) {
            return;
        }
        const event = this.createEvent(null, context, additionalProperties);
        this.updateEvent(event, cards, context, additionalProperties);
        events.push(event);
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnLookAtCards, Context>, cards: BaseCard | BaseCard[] | null | undefined, context: Context, additionalProperties: ActionOverrides): void {
        const resolved = targetList(cards || this.getProperties(context, additionalProperties).target);
        event.cards = resolved;
        event.stateBeforeResolution = resolved.map((a: BaseCard) => {
            return { card: a, location: a.location };
        });
        event.context = context;
    }

    override eventHandler(event: ActionEvent<EventName.OnLookAtCards, Context>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const properties = this.getProperties(context, additionalProperties);
        context.game.addMessage(properties.message(context, event.cards));
    }

    override isEventFullyResolved(event: AnyEvent): boolean {
        return !event.cancelled && event.name === this.eventName;
    }

    override checkEventCondition(): boolean {
        return true;
    }
}
