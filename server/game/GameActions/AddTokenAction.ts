import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardTypes, EventNames, Locations, TokenTypes } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export interface AddTokenProperties extends CardActionProperties {
    tokenType?: TokenTypes;
}

export class AddTokenAction extends CardGameAction<AddTokenProperties> {
    name = 'addToken';
    eventName = EventNames.OnAddTokenToCard;
    defaultProperties: AddTokenProperties = {
        tokenType: TokenTypes.Honor
    };

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let properties: AddTokenProperties = this.getProperties(context);
        return ['add a {1} token to {0}', [properties.target, properties.tokenType]];
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(!card.isFaceup()) {
            return false;
        }
        if([CardTypes.Holding, CardTypes.Province].includes(card.type)) {
            if(!card.location.includes('province')) {
                return false;
            }
        } else if(card.location !== Locations.PlayArea) {
            return false;
        }
        return super.canAffect(card, context);
    }

    addPropertiesToEvent(event: GameEvent<EventNames.OnAddTokenToCard>, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        const { tokenType } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.tokenType = tokenType;
    }

    eventHandler(event: GameEvent<EventNames.OnAddTokenToCard>): void {
        event.card.addToken(event.tokenType ?? '');
    }
}
