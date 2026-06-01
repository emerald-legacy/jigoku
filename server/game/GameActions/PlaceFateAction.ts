import type { Event } from '../Events/Event.js';
import { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardTypes, EventNames, Locations } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import Ring from '../Ring.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';

export interface PlaceFateProperties extends CardActionProperties {
    amount?: number;
    origin?: DrawCard | Player | Ring;
}

export class PlaceFateAction extends CardGameAction {
    name = 'placeFate';
    eventName = EventNames.OnMoveFate;
    targetType = [CardTypes.Character];
    defaultProperties: PlaceFateProperties = { amount: 1 };
    constructor(properties: ((context: AbilityContext) => PlaceFateProperties) | PlaceFateProperties) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        const { amount, target } = this.getProperties(context) as PlaceFateProperties;
        return ['place {1} fate on {0}', [target, amount]];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        const { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateProperties;
        if(amount === 0 || card.location !== Locations.PlayArea) {
            return false;
        }

        if(origin instanceof Ring && !context.player.checkRestrictions('takeFateFromRings', context)) {
            return false;
        }

        return super.canAffect(card, context) && this.checkOrigin(context, origin) && card !== origin;
    }

    checkOrigin(context: AbilityContext, origin?: Player | Ring | DrawCard): boolean {
        if(!origin) {
            return true;
        }

        return (
            origin.fate > 0 &&
            (origin.type === 'player' || origin.type === 'ring' || origin.allowGameAction('removeFate', context))
        );
    }

    addPropertiesToEvent(event: Event, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        const { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateProperties;
        event.fate = amount;
        event.origin = origin;
        event.context = context;
        event.recipient = card;
    }

    checkEventCondition(event: Event): boolean {
        return this.moveFateEventCondition(event);
    }

    isEventFullyResolved(event: Event, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): boolean {
        const { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateProperties;
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
