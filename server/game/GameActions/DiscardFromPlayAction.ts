import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Location } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { ActionEvent } from './GameAction.js';
export type DiscardFromPlayProperties = CardActionProperties;

export class DiscardFromPlayAction<C extends AbilityContext = AbilityContext> extends CardGameAction<DiscardFromPlayProperties, EventName, C> {
    name = 'discardFromPlay';
    eventName = EventName.OnCardLeavesPlay;
    cost = 'sacrificing {0}';
    targetType = [CardType.Character, CardType.Attachment, CardType.Holding];

    constructor(propertyFactory: DiscardFromPlayProperties | ((context: C) => DiscardFromPlayProperties), isSacrifice = false) {
        super(propertyFactory);
        if(isSacrifice) {
            this.name = 'sacrifice';
        }
    }

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return [this.name === 'sacrifice' ? 'sacrifice {0}' : 'discard {0}', [properties.target]];
    }

    canAffect(card: BaseCard, context: C): boolean {
        if(card.type === CardType.Holding) {
            if(this.name === 'sacrifice' && card.facedown) {
                return false;
            }
            if(!card.location.includes('province')) {
                return false;
            }
        } else if(card.location !== Location.PlayArea) {
            return false;
        }
        return super.canAffect(card, context);
    }

    updateEvent(event: ActionEvent<EventName.OnCardLeavesPlay, C>, card: BaseCard, context: C, additionalProperties: Record<string, unknown> = {}): void {
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
    }

    eventHandler(event: ActionEvent<EventName.OnCardLeavesPlay, C>, additionalProperties: Record<string, unknown> = {}): void {
        this.leavesPlayEventHandler(event, additionalProperties);
    }
}
