import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, Location } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export interface PlaceFateAttachmentProperties extends CardActionProperties {
    amount?: number;
    origin?: DrawCard | Player | Ring;
}

export class PlaceFateAttachmentAction<C extends AbilityContext = AbilityContext> extends CardGameAction<PlaceFateAttachmentProperties, EventName, C> {
    name = 'placeFate';
    eventName = EventName.OnMoveFate;
    targetType = [CardType.Attachment];
    defaultProperties: PlaceFateAttachmentProperties = { amount: 1 };
    constructor(
        properties: ((context: C) => PlaceFateAttachmentProperties) | PlaceFateAttachmentProperties
    ) {
        super(properties);
    }

    getEffectMessage(context: C): MessageArgs {
        let { amount, target } = this.getProperties(context);
        return ['place {1} fate on {0}', [target, amount]];
    }

    canAffect(card: DrawCard, context: C, additionalProperties = {}): boolean {
        let { amount, origin } = this.getProperties(context, additionalProperties);
        if(amount === 0 || card.location !== Location.PlayArea) {
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

    checkOrigin(origin: Player | Ring | DrawCard | undefined, context: C): boolean {
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

    addPropertiesToEvent(event: ActionEvent<EventName.OnMoveFate, C>, card: BaseCard, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let { amount, origin } = this.getProperties(context, additionalProperties);
        event.fate = amount ?? 0;
        event.origin = origin;
        event.context = context;
        event.recipient = card;
    }

    checkEventCondition(event: ActionEvent<EventName.OnMoveFate, C>): boolean {
        return this.moveFateEventCondition(event);
    }

    isEventFullyResolved(event: ActionEvent<EventName.OnMoveFate, C>, card: BaseCard, context: C, additionalProperties: Record<string, unknown> = {}): boolean {
        let { amount, origin } = this.getProperties(context, additionalProperties);
        return (
            !event.cancelled &&
            event.name === this.eventName &&
            event.fate === amount &&
            event.origin === origin &&
            event.recipient === card
        );
    }

    eventHandler(event: ActionEvent<EventName.OnMoveFate, C>): void {
        this.moveFateEventHandler(event);
    }
}
