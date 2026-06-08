import type { MessageArgs } from '../GameChat.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName } from '../Constants.js';
import Effects from '../effects.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export interface PlaceCardUnderneathProperties extends CardActionProperties {
    destination?: BaseCard;
    hideWhenFaceup?: boolean;
}

export class PlaceCardUnderneathAction extends CardGameAction {
    name = 'placeCardUnderneath';
    targetType = [CardType.Character, CardType.Attachment, CardType.Event, CardType.Holding];
    defaultProperties: PlaceCardUnderneathProperties = {
        destination: undefined,
        hideWhenFaceup: true
    };
    constructor(
        properties: PlaceCardUnderneathProperties | ((context: AbilityContext) => PlaceCardUnderneathProperties)
    ) {
        super(properties);
    }

    getCostMessage(context: AbilityContext): MessageArgs {
        let properties = this.getProperties(context) as PlaceCardUnderneathProperties;
        return ['placing {0} underneath {1}', [properties.target, properties.destination]];
    }

    getEffectMessage(context: AbilityContext): MessageArgs {
        let properties = this.getProperties(context) as PlaceCardUnderneathProperties;
        return ['place {0} underneath {1}', [properties.target, properties.destination]];
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        const { destination } = this.getProperties(context, additionalProperties) as PlaceCardUnderneathProperties;
        return !!(destination && destination.uuid) && super.canAffect(card, context);
    }

    eventHandler(event: GameEvent<EventName.Unnamed>, additionalProperties: Record<string, unknown> = {}): void {
        let context = event.context as AbilityContext;
        let card = event.card as BaseCard;
        event.cardStateWhenMoved = card.createSnapshot();
        let properties = this.getProperties(context, additionalProperties) as PlaceCardUnderneathProperties;
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
