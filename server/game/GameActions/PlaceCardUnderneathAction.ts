import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, type EventName, Location } from '../Constants.js';
import { hideWhenFaceUp } from '../Effects/Library/hideWhenFaceUp.js';
import { type CardActionProperties, type CardEvent, CardGameAction } from './CardGameAction.js';

export interface PlaceCardUnderneathProperties extends CardActionProperties {
    destination?: BaseCard;
    hideWhenFaceup?: boolean;
}

export class PlaceCardUnderneathAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<PlaceCardUnderneathProperties, EventName.Unnamed, Context, 'hideWhenFaceup'> {
    override name = 'placeCardUnderneath';
    override targetType = [CardType.Character, CardType.Attachment, CardType.Event, CardType.Holding];
    override defaultProperties = {
        hideWhenFaceup: true
    };

    override getCostMessage(context: Context): MessageArgs {
        const properties = this.getProperties(context);
        return ['placing {0} underneath {1}', [properties.target, properties.destination]];
    }

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        return ['place {0} underneath {1}', [this.getProperties(context, additionalProperties).destination]];
    }

    override canAffect(card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { destination } = this.getProperties(context, additionalProperties);
        return !!destination && super.canAffect(card, context);
    }

    override eventHandler(event: CardEvent<EventName.Unnamed, Context>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const card = event.card;
        if(card.isDrawCard()) {
            event.cardStateWhenMoved = card.createSnapshot();
        }
        const properties = this.getProperties(context, additionalProperties);
        if(!properties.destination) {
            return;
        }

        context.player.placeUnderneath(card, properties.destination);
        card.controller = context.source.controller;
        card.facedown = false;
        if(properties.hideWhenFaceup) {
            card.lastingEffect({
                until: {
                    onCardMoved: (event: GameEvent<EventName.OnCardMoved>) => event.card === card && event.originalLocation === Location.Underneath
                },
                match: card,
                effect: hideWhenFaceUp()
            });
        }
    }
}
