import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { CardType, EventName, Location } from '../Constants.js';
import type { CardActionProperties } from './CardGameAction.js';
import { LeavesPlayAction, type LeavesPlayEvent } from './LeavesPlayAction.js';

import type { ActionEvent } from './GameAction.js';
export interface RemoveFromGameProperties extends CardActionProperties {
    location?: Location | Location[];
}

export class RemoveFromGameAction<C extends AbilityContext = AbilityContext> extends LeavesPlayAction<RemoveFromGameProperties, C> {
    name = 'removeFromGame';
    eventName = EventName.OnCardLeavesPlay;
    cost = 'removing {0} from the game';
    targetType = [CardType.Character, CardType.Attachment, CardType.Holding, CardType.Event];
    effect = 'remove {0} from the game';

    canAffect(card: BaseCard, context: C, additionalProperties: Record<string, unknown> = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
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

    updateEvent(event: ActionEvent<EventName.OnCardLeavesPlay, C>, card: DrawCard, context: C, additionalProperties: Record<string, unknown>): void {
        additionalProperties.destination = Location.RemovedFromGame;
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
    }

    eventHandler(event: LeavesPlayEvent<C>, additionalProperties: Record<string, unknown> = {}): void {
        this.leavesPlayEventHandler(event, additionalProperties);
    }
}
