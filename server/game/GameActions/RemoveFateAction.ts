import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardTypes, EventNames, Locations } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export interface RemoveFateProperties extends CardActionProperties {
    amount?: number;
    recipient?: DrawCard | Player | Ring;
}

export class RemoveFateAction extends CardGameAction {
    name = 'removeFate';
    eventName = EventNames.OnMoveFate;
    targetType = [CardTypes.Character];
    defaultProperties: RemoveFateProperties = { amount: 1 };
    constructor(properties: ((context: AbilityContext) => RemoveFateProperties) | RemoveFateProperties) {
        super(properties);
    }

    getCostMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as RemoveFateProperties;
        return ['removing {1} fate from {0}', [properties.amount]];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as RemoveFateProperties;
        return ['remove {1} fate from {0}', [properties.target, properties.amount]];
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as RemoveFateProperties;
        if(properties.amount === 0 || card.location !== Locations.PlayArea || card.getFate() === 0) {
            return false;
        }
        return super.canAffect(card, context) && this.checkRecipient(properties.recipient, context);
    }

    checkRecipient(origin: Player | Ring | DrawCard | undefined, context: AbilityContext): boolean {
        if(origin) {
            if(['player', 'ring'].includes(origin.type)) {
                return true;
            }
            return origin.allowGameAction('placeFate', context);
        }
        return true;
    }

    addPropertiesToEvent(event: any, card: any, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { amount, recipient } = this.getProperties(context, additionalProperties) as RemoveFateProperties;
        event.fate = amount;
        event.recipient = recipient;
        event.origin = card;
        event.context = context;
    }

    checkEventCondition(event: any): boolean {
        return this.moveFateEventCondition(event);
    }

    isEventFullyResolved(event: any, card: any, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): boolean {
        let { amount, recipient } = this.getProperties(context, additionalProperties) as RemoveFateProperties;
        return (
            !event.cancelled &&
            event.name === this.eventName &&
            event.fate === amount &&
            event.origin === card &&
            event.recipient === recipient
        );
    }

    eventHandler(event: any): void {
        this.moveFateEventHandler(event);
    }
}
