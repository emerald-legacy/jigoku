import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type FlipDynastyProperties = CardActionProperties;

export class FlipDynastyAction extends CardGameAction<FlipDynastyProperties> {
    name = 'reveal';
    eventName = EventName.OnCardRevealed;
    targetType = [CardType.Character, CardType.Holding, CardType.Event];

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context);
        const target = Array.isArray(properties.target) ? properties.target[0] : properties.target;
        return ['reveal the facedown card in {0}', [target ? target.location : '']];
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        return card.isInProvince() && card.isDynasty && card.isFacedown() && super.canAffect(card, context);
    }

    eventHandler(event: GameEvent<EventName.OnCardRevealed>): void {
        event.card.facedown = false;
    }
}
