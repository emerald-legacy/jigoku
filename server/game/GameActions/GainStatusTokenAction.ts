import type { MessageArgs } from '../GameChat.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CharacterStatus, EventName } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export interface GainStatusTokenProperties extends CardActionProperties {
    token?: CharacterStatus;
}

export class GainStatusTokenAction extends CardGameAction<GainStatusTokenProperties> {
    name = 'gainStatus';
    eventName = EventName.OnStatusTokenGained;
    defaultProperties: GainStatusTokenProperties = {
        token: CharacterStatus.Honored
    };

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        let { token } = this.getProperties(context) as GainStatusTokenProperties;
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

    getEffectMessage(context: AbilityContext): MessageArgs {
        let properties = this.getProperties(context);
        return ['give {0} a {1} status token', [properties.target, properties.token]];
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnStatusTokenGained>, card: BaseCard, context: AbilityContext, additionalProperties = {}): void {
        const { token } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.token = token;
    }

    eventHandler(event: GameEvent<EventName.OnStatusTokenGained>): void {
        (event.card as BaseCard).addStatusToken(event.token as CharacterStatus);
    }
}
