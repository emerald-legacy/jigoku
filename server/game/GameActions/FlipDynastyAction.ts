import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardTypes, EventNames } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type FlipDynastyProperties = CardActionProperties;

export class FlipDynastyAction extends CardGameAction<FlipDynastyProperties> {
    name = 'reveal';
    eventName = EventNames.OnCardRevealed;
    targetType = [CardTypes.Character, CardTypes.Holding, CardTypes.Event];

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context);
        const target = Array.isArray(properties.target) ? properties.target[0] : properties.target;
        return ['reveal the facedown card in {0}', [target ? target.location : '']];
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        return card.isInProvince() && card.isDynasty && card.isFacedown() && super.canAffect(card, context);
    }

    eventHandler(event: Event): void {
        event.card.facedown = false;
    }
}
