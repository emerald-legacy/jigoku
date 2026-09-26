import type { MessageArgs } from '../GameChat.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName } from '../Constants.js';
import Effects from '../effects.js';
import { type CardActionProperties, type CardEvent, CardGameAction } from './CardGameAction.js';

export interface PlaceCardUnderneathProperties extends CardActionProperties {
    destination?: BaseCard;
    hideWhenFaceup?: boolean;
}

export class PlaceCardUnderneathAction<C extends AbilityContext = AbilityContext> extends CardGameAction<PlaceCardUnderneathProperties, EventName.Unnamed, C> {
    name = 'placeCardUnderneath';
    targetType = [CardType.Character, CardType.Attachment, CardType.Event, CardType.Holding];
    defaultProperties: PlaceCardUnderneathProperties = {
        destination: undefined,
        hideWhenFaceup: true
    };
    constructor(
        properties: PlaceCardUnderneathProperties | ((context: C) => PlaceCardUnderneathProperties)
    ) {
        super(properties);
    }

    getCostMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['placing {0} underneath {1}', [properties.target, properties.destination]];
    }

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['place {0} underneath {1}', [properties.target, properties.destination]];
    }

    canAffect(card: BaseCard, context: C, additionalProperties = {}): boolean {
        const { destination } = this.getProperties(context, additionalProperties);
        return !!(destination && destination.uuid) && super.canAffect(card, context);
    }

    eventHandler(event: CardEvent<EventName.Unnamed, C>, additionalProperties: Record<string, unknown> = {}): void {
        let context = event.context;
        let card = event.card;
        if(card.isDrawCard()) {
            event.cardStateWhenMoved = card.createSnapshot();
        }
        let properties = this.getProperties(context, additionalProperties);
        if(!properties.destination) {
            return;
        }
        let destination = properties.destination.uuid;

        context.player.moveCard(card, destination);
        card.controller = context.source.controller;
        card.facedown = false;
        if(properties.hideWhenFaceup) {
            card.lastingEffect(() => ({
                until: {
                    onCardMoved: (event: GameEvent<EventName.OnCardMoved>) => event.card === card && event.originalLocation === destination
                },
                match: card,
                effect: Effects.hideWhenFaceUp()
            }));
        }
    }
}
