import type { MessageArgs } from '../GameChat.js';
import { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import Ring from '../Ring.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export interface PlaceFateProperties extends CardActionProperties {
    amount?: number;
    origin?: DrawCard | Player | Ring;
}

export class PlaceFateAction<C extends AbilityContext = AbilityContext> extends CardGameAction<PlaceFateProperties, EventName, C> {
    name = 'placeFate';
    eventName = EventName.OnMoveFate;
    targetType = [CardType.Character];
    defaultProperties: PlaceFateProperties = { amount: 1 };
    constructor(properties: ((context: C) => PlaceFateProperties) | PlaceFateProperties) {
        super(properties);
    }

    getEffectMessage(context: C): MessageArgs {
        const { amount, target } = this.getProperties(context);
        return ['place {1} fate on {0}', [target, amount]];
    }

    canAffect(card: DrawCard, context: C, additionalProperties = {}): boolean {
        const { amount, origin } = this.getProperties(context, additionalProperties);
        if(amount === 0 || card.location !== Location.PlayArea) {
            return false;
        }

        if(origin instanceof Ring && !context.player.checkRestrictions('takeFateFromRings', context)) {
            return false;
        }

        return super.canAffect(card, context) && this.checkOrigin(context, origin) && card !== origin;
    }

    checkOrigin(context: C, origin?: Player | Ring | DrawCard): boolean {
        if(!origin) {
            return true;
        }

        return (
            origin.fate > 0 &&
            (origin.type === 'player' || origin.type === 'ring' || origin.allowGameAction('removeFate', context))
        );
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnMoveFate, C>, card: BaseCard, context: C, additionalProperties: Record<string, unknown> = {}): void {
        const { amount, origin } = this.getProperties(context, additionalProperties);
        event.fate = amount ?? 0;
        event.origin = origin;
        event.context = context;
        event.recipient = card;
    }

    checkEventCondition(event: ActionEvent<EventName.OnMoveFate, C>): boolean {
        return this.moveFateEventCondition(event);
    }

    isEventFullyResolved(event: ActionEvent<EventName.OnMoveFate, C>, card: BaseCard, context: C, additionalProperties: Record<string, unknown> = {}): boolean {
        const { amount, origin } = this.getProperties(context, additionalProperties);
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
