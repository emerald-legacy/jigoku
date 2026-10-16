import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { CardType, type EventName, Location, RestrictionType } from '../Constants.js';
import type { CardActionProperties } from './CardGameAction.js';
import { LeavesPlayAction } from './LeavesPlayAction.js';
import type { ActionEvent } from './GameAction.js';

export interface RemoveFromGameProperties extends CardActionProperties {
    location?: Location | Location[];
}

export class RemoveFromGameAction<Context extends AbilityContext = AbilityContext> extends LeavesPlayAction<RemoveFromGameProperties, Context> {
    override name = 'removeFromGame';
    override restriction = RestrictionType.RemoveFromGame;
    override cost = 'removing {0} from the game';
    override targetType = [CardType.Character, CardType.Attachment, CardType.Holding, CardType.Event];
    override effect = 'remove {0} from the game';

    override canAffect(card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
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
            if(!card.isInProvince()) {
                return false;
            }
        } else if(card.location !== Location.PlayArea) {
            return false;
        }

        return super.canAffect(card, context);
    }

    override updateEvent(event: ActionEvent<EventName.OnCardLeavesPlay, Context>, card: DrawCard, context: Context, additionalProperties: Record<string, unknown>): void {
        super.updateEvent(event, card, context, { ...additionalProperties, destination: Location.RemovedFromGame });
    }
}
