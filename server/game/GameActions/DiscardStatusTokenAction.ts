import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName } from '../Constants.js';
import type { StatusToken } from '../StatusToken.js';
import { TokenAction, type TokenActionProperties } from './TokenAction.js';
import { targetList, type ActionEvent, type ActionOverrides } from './GameAction.js';

export type DiscardStatusProperties = TokenActionProperties;

export class DiscardStatusTokenAction<C extends AbilityContext = AbilityContext> extends TokenAction<DiscardStatusProperties, EventName.OnStatusTokenDiscarded, C> {
    name = 'discardStatusToken';
    eventName = EventName.OnStatusTokenDiscarded;
    cost = 'discarding a status token';

    protected effectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const cardsLosingStatus = this.#cardsLosingStatus(context, additionalProperties);
        return cardsLosingStatus.length === 0
            ? ['discard a status token', []]
            : ['discard {0}\'s status token', cardsLosingStatus.slice(1)];
    }

    protected effectMessageTarget(context: C, additionalProperties: ActionOverrides = {}): MsgArg {
        return this.#cardsLosingStatus(context, additionalProperties)[0];
    }

    addPropertiesToEvent(
        event: ActionEvent<EventName.OnStatusTokenDiscarded, C>,
        token: StatusToken,
        context: C,
        additionalProperties: Record<string, unknown>
    ): void {
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.cards = this.#cardsLosingStatus(context, additionalProperties);
    }

    eventHandler(event: ActionEvent<EventName.OnStatusTokenDiscarded, C>): void {
        const token = event.token;
        if(token.card) {
            token.card.removeStatusToken(token);
        }
    }

    #cardsLosingStatus(context: C, additionalProperties: ActionOverrides): BaseCard[] {
        return targetList(this.getProperties(context, additionalProperties).target).flatMap((token) => token.card ? [token.card] : []);
    }
}
