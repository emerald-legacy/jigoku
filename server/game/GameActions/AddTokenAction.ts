import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Location, TokenType } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export interface AddTokenProperties extends CardActionProperties {
    tokenType?: TokenType;
}

/** An add-token event this action created: `addPropertiesToEvent` always sets its token type. */
type AddTokenEvent<C extends AbilityContext> = ActionEvent<EventName.OnAddTokenToCard, C> & { tokenType: TokenType };

export class AddTokenAction<C extends AbilityContext = AbilityContext> extends CardGameAction<AddTokenProperties, EventName.OnAddTokenToCard, C, 'tokenType'> {
    name = 'addToken';
    eventName = EventName.OnAddTokenToCard;
    defaultProperties = {
        tokenType: TokenType.Honor
    };

    protected effectMessage(context: C): MessageArgs {
        return ['add a {1} token to {0}', [this.getProperties(context).tokenType]];
    }

    canAffect(card: BaseCard, context: C): boolean {
        if(!card.isFaceup()) {
            return false;
        }
        if([CardType.Holding, CardType.Province].includes(card.type)) {
            if(!card.isInProvince()) {
                return false;
            }
        } else if(card.location !== Location.PlayArea) {
            return false;
        }
        return super.canAffect(card, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnAddTokenToCard, C>, card: BaseCard, context: C, additionalProperties: Record<string, unknown> = {}): void {
        const { tokenType } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.tokenType = tokenType;
    }

    eventHandler(event: AddTokenEvent<C>): void {
        event.card.addToken(event.tokenType);
    }
}
