import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Location } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export interface RemoveFromGameProperties extends CardActionProperties {
    location?: Location | Location[];
}

export class RemoveFromGameAction extends CardGameAction {
    name = 'removeFromGame';
    eventName = EventName.OnCardLeavesPlay;
    cost = 'removing {0} from the game';
    targetType = [CardType.Character, CardType.Attachment, CardType.Holding, CardType.Event];
    effect = 'remove {0} from the game';

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): boolean {
        const properties = this.getProperties(context, additionalProperties) as RemoveFromGameProperties;
        const propValidLocations = Array.isArray(properties.location)
            ? properties.location
            : properties.location
                ? [properties.location]
                : undefined;

        if(propValidLocations) {
            for(const validLocation of propValidLocations) {
                if(validLocation === Location.Any || card.location === validLocation) {
                    return true;
                }
            }
            return false;
        }

        if(card.type === CardType.Holding) {
            if(!card.location.includes('province')) {
                return false;
            }
        } else if(card.location !== Location.PlayArea) {
            return false;
        }

        return super.canAffect(card, context);
    }

    updateEvent(event: GameEvent<EventName.OnCardLeavesPlay>, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown>): void {
        additionalProperties.destination = Location.RemovedFromGame;
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
    }

    eventHandler(event: GameEvent<EventName.OnCardLeavesPlay>, additionalProperties: Record<string, unknown> = {}): void {
        this.leavesPlayEventHandler(event, additionalProperties);
    }
}
