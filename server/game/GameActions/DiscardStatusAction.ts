import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName } from '../Constants.js';
import type { StatusToken } from '../StatusToken.js';
import { TokenAction, TokenActionProperties } from './TokenAction.js';
import { targetList, type ActionEvent } from './GameAction.js';

export type DiscardStatusProperties = TokenActionProperties;

export class DiscardStatusAction<C extends AbilityContext = AbilityContext> extends TokenAction<DiscardStatusProperties, EventName.OnStatusTokenDiscarded, C> {
    name = 'discardStatus';
    eventName = EventName.OnStatusTokenDiscarded;
    cost = 'discarding a status token';

    getEffectMessage(context: C): MessageArgs {
        const cardsLosingStatus = this.#cardsLosingStatus(context);
        return cardsLosingStatus.length === 0
            ? ['discard a status token', []]
            : ['discard {0}\'s status token', cardsLosingStatus];
    }

    addPropertiesToEvent(
        event: ActionEvent<EventName.OnStatusTokenDiscarded, C>,
        token: StatusToken,
        context: C,
        additionalProperties: Record<string, unknown>
    ): void {
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.cards = this.#cardsLosingStatus(context);
    }

    eventHandler(event: ActionEvent<EventName.OnStatusTokenDiscarded, C>): void {
        const token = event.token;
        if(token.card) {
            token.card.removeStatusToken(token);
        }
    }

    #cardsLosingStatus(context: C): BaseCard[] {
        return targetList(this.getProperties(context).target).flatMap((token) => token.card ? [token.card] : []);
    }
}
