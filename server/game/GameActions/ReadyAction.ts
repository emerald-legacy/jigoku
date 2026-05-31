import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardTypes, EventNames, Locations } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type ReadyProperties = CardActionProperties;

export class ReadyAction extends CardGameAction {
    name = 'ready';
    eventName = EventNames.OnCardReadied;
    cost = 'readying {0}';
    effect = 'ready {0}';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Stronghold];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if((card.location !== Locations.PlayArea && card.type !== CardTypes.Stronghold) || !card.bowed) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: Event): void {
        event.card.ready();
    }
}
