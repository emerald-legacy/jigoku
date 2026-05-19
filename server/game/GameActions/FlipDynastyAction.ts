import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../basecard.js';
import { CardTypes, EventNames } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type FlipDynastyProperties = CardActionProperties;

export class FlipDynastyAction extends CardGameAction<FlipDynastyProperties> {
    name = 'reveal';
    eventName = EventNames.OnCardRevealed;
    targetType = [CardTypes.Character, CardTypes.Holding, CardTypes.Event];

    getEffectMessage(context): [string, any[]] {
        let properties = this.getProperties(context);
        return ['reveal the facedown card in {0}', [properties.target[0].location]];
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        return card.isInProvince() && card.isDynasty && card.isFacedown() && super.canAffect(card, context);
    }

    eventHandler(event): void {
        event.card.facedown = false;
    }
}
