import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type FlipDynastyProperties = CardActionProperties;

export class FlipDynastyAction<C extends AbilityContext = AbilityContext> extends CardGameAction<FlipDynastyProperties, EventName.OnCardRevealed, C> {
    name = 'reveal';
    eventName = EventName.OnCardRevealed;
    targetType = [CardType.Character, CardType.Holding, CardType.Event];

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        const target = Array.isArray(properties.target) ? properties.target[0] : properties.target;
        return ['reveal the facedown card in {0}', [target ? target.location : '']];
    }

    canAffect(card: BaseCard, context: C): boolean {
        return card.isInProvince() && card.isDynasty && card.isFacedown() && super.canAffect(card, context);
    }

    eventHandler(event: ActionEvent<EventName.OnCardRevealed, C>): void {
        event.card.facedown = false;
    }
}
