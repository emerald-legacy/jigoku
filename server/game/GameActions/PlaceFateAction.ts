import type { MessageArgs } from '../GameChat.js';
import { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Location } from '../Constants.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import Ring from '../Ring.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';

export interface PlaceFateProperties extends CardActionProperties {
    amount?: number;
    origin?: DrawCard | Player | Ring;
}

export class PlaceFateAction extends CardGameAction<PlaceFateProperties> {
    name = 'placeFate';
    eventName = EventName.OnMoveFate;
    targetType = [CardType.Character];
    defaultProperties: PlaceFateProperties = { amount: 1 };
    constructor(properties: ((context: AbilityContext) => PlaceFateProperties) | PlaceFateProperties) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): MessageArgs {
        const { amount, target } = this.getProperties(context) as PlaceFateProperties;
        return ['place {1} fate on {0}', [target, amount]];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        const { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateProperties;
        if(amount === 0 || card.location !== Location.PlayArea) {
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

    addPropertiesToEvent(event: GameEvent<EventName.OnMoveFate>, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        const { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateProperties;
        event.fate = amount ?? 0;
        event.origin = origin;
        event.context = context;
        event.recipient = card;
    }

    checkEventCondition(event: GameEvent<EventName.OnMoveFate>): boolean {
        return this.moveFateEventCondition(event);
    }

    isEventFullyResolved(event: GameEvent<EventName.OnMoveFate>, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): boolean {
        const { amount, origin } = this.getProperties(context, additionalProperties) as PlaceFateProperties;
        return (
            !event.cancelled &&
            event.name === this.eventName &&
            event.fate === amount &&
            event.origin === origin &&
            event.recipient === card
        );
    }

    eventHandler(event: GameEvent<EventName.OnMoveFate>): void {
        this.moveFateEventHandler(event);
    }
}
