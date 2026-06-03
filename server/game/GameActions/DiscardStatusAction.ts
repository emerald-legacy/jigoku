import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventNames } from '../Constants.js';
import type { StatusToken } from '../StatusToken.js';
import { TokenAction, TokenActionProperties } from './TokenAction.js';

export type DiscardStatusProperties = TokenActionProperties;

export class DiscardStatusAction extends TokenAction<DiscardStatusProperties> {
    name = 'discardStatus';
    eventName = EventNames.OnStatusTokenDiscarded;
    cost = 'discarding a status token';

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        const cardsLosingStatus = this.#cardsLosingStatus(context);
        return cardsLosingStatus.length === 0
            ? ['discard a status token', []]
            : ['discard {0}\'s status token', cardsLosingStatus];
    }

    addPropertiesToEvent(
        event: GameEvent<EventNames.OnStatusTokenDiscarded>,
        token: StatusToken,
        context: AbilityContext,
        additionalProperties: Record<string, unknown>
    ): void {
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.cards = this.#cardsLosingStatus(context) as BaseCard[];
    }

    eventHandler(event: GameEvent<EventNames.OnStatusTokenDiscarded>): void {
        const tokens = Array.isArray(event.token) ? event.token : [event.token];
        for(const token of tokens) {
            token.card.removeStatusToken(token);
        }
    }

    #cardsLosingStatus(context: AbilityContext) {
        let properties = this.getProperties(context);
        if(!properties.target) {
            return [];
        }

        const targets = Array.isArray(properties.target) ? properties.target : [properties.target];
        return targets.map((a) => {
            let token = a as StatusToken;
            if(token) {
                return token.card;
            }
            return a;
        });
    }
}
