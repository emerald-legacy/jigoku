import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardTypes, EventNames, Locations } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { Event } from '../Events/Event.js';
export type DiscardFromPlayProperties = CardActionProperties;

export class DiscardFromPlayAction extends CardGameAction<DiscardFromPlayProperties> {
    name = 'discardFromPlay';
    eventName = EventNames.OnCardLeavesPlay;
    cost = 'sacrificing {0}';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Holding];

    constructor(propertyFactory: DiscardFromPlayProperties | ((context?: AbilityContext) => DiscardFromPlayProperties), isSacrifice = false) {
        super(propertyFactory);
        if(isSacrifice) {
            this.name = 'sacrifice';
        }
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context);
        return [this.name === 'sacrifice' ? 'sacrifice {0}' : 'discard {0}', [properties.target]];
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.type === CardTypes.Holding) {
            if(this.name === 'sacrifice' && card.facedown) {
                return false;
            }
            if(!card.location.includes('province')) {
                return false;
            }
        } else if(card.location !== Locations.PlayArea) {
            return false;
        }
        return super.canAffect(card, context);
    }

    updateEvent(event: Event, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
    }

    eventHandler(event: Event, additionalProperties: Record<string, unknown> = {}): void {
        this.leavesPlayEventHandler(event, additionalProperties);
    }
}
