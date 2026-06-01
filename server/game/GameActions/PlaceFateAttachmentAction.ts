import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardTypes, EventNames, Locations } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export interface PlaceFateAttachmentProperties extends CardActionProperties {
    amount?: number;
    origin?: DrawCard | Player | Ring;
}

export class PlaceFateAttachmentAction extends CardGameAction {
    name = 'placeFate';
    eventName = EventNames.OnMoveFate;
    targetType = [CardTypes.Attachment];
    defaultProperties: PlaceFateAttachmentProperties = { amount: 1 };
    constructor(
        properties: ((context: AbilityContext) => PlaceFateAttachmentProperties) | PlaceFateAttachmentProperties
    ) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let { amount, target } = this.getProperties(context) as PlaceFateAttachmentProperties;
        return ['place {1} fate on {0}', [target, amount]];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        let { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateAttachmentProperties;
        if(amount === 0 || card.location !== Locations.PlayArea) {
            return false;
        }

        if(origin && this.isRing(origin) && !context.player.checkRestrictions('takeFateFromRings', context)) {
            return false;
        }

        return super.canAffect(card, context) && this.checkOrigin(origin, context) && card !== origin;
    }

    isRing(x: DrawCard | Player | Ring): x is Ring {
        return 'element' in x;
    }

    checkOrigin(origin: Player | Ring | DrawCard | undefined, context: AbilityContext): boolean {
        if(origin) {
            if(origin.fate === 0) {
                return false;
            } else if(['player', 'ring'].includes(origin.type)) {
                return true;
            }
            return origin.allowGameAction('removeFate', context);
        }
        return true;
    }

    addPropertiesToEvent(event: Event, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateAttachmentProperties;
        event.fate = amount;
        event.origin = origin;
        event.context = context;
        event.recipient = card;
    }

    checkEventCondition(event: Event): boolean {
        return this.moveFateEventCondition(event);
    }

    isEventFullyResolved(event: Event, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): boolean {
        let { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateAttachmentProperties;
        return (
            !event.cancelled &&
            event.name === this.eventName &&
            event.fate === amount &&
            event.origin === origin &&
            event.recipient === card
        );
    }

    eventHandler(event: Event): void {
        this.moveFateEventHandler(event);
    }
}
