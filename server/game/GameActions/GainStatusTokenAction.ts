import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CharacterStatus, EventName } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export interface GainStatusTokenProperties extends CardActionProperties {
    token?: CharacterStatus;
}

export class GainStatusTokenAction<C extends AbilityContext = AbilityContext> extends CardGameAction<GainStatusTokenProperties, EventName.OnStatusTokenGained, C, 'token'> {
    name = 'gainStatus';
    eventName = EventName.OnStatusTokenGained;
    defaultProperties = {
        token: CharacterStatus.Honored
    };

    canAffect(card: BaseCard, context: C): boolean {
        const { token } = this.getProperties(context);
        if(
            (token === CharacterStatus.Honored && card.isHonored) ||
            (token === CharacterStatus.Dishonored && card.isDishonored)
        ) {
            return false;
        }
        if(token === CharacterStatus.Dishonored && !card.checkRestrictions('receiveDishonorToken', context)) {
            return false;
        }
        if(token === CharacterStatus.Honored && !card.checkRestrictions('receiveHonorToken', context)) {
            return false;
        }

        return super.canAffect(card, context);
    }

    protected effectMessage(context: C): MessageArgs {
        return ['give {0} a {1} status token', [this.getProperties(context).token]];
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnStatusTokenGained, C>, card: BaseCard, context: C, additionalProperties: ActionOverrides = {}): void {
        const { token } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.token = token;
    }

    eventHandler(event: ActionEvent<EventName.OnStatusTokenGained, C>): void {
        if(event.token) {
            event.card.addStatusToken(event.token);
        }
    }
}
