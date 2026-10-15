import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CharacterStatus, EventName, RestrictionType } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export interface GainStatusTokenProperties extends CardActionProperties {
    token?: CharacterStatus;
}

export class GainStatusTokenAction<C extends AbilityContext = AbilityContext> extends CardGameAction<GainStatusTokenProperties, EventName.OnStatusTokenGained, C, 'token'> {
    override name = 'gainStatusToken';
    override eventName = EventName.OnStatusTokenGained;
    override defaultProperties = {
        token: CharacterStatus.Honored
    };

    override canAffect(card: BaseCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { token } = this.getProperties(context, additionalProperties);
        if(
            (token === CharacterStatus.Honored && card.isHonored) ||
            (token === CharacterStatus.Dishonored && card.isDishonored) ||
            (token === CharacterStatus.Tainted && card.isTainted)
        ) {
            return false;
        }
        if(token === CharacterStatus.Dishonored && !card.checkRestrictions(RestrictionType.ReceiveDishonorToken, context)) {
            return false;
        }
        if(token === CharacterStatus.Honored && !card.checkRestrictions(RestrictionType.ReceiveHonorToken, context)) {
            return false;
        }
        if(token === CharacterStatus.Tainted && !card.checkRestrictions(RestrictionType.ReceiveTaintedToken, context)) {
            return false;
        }

        return super.canAffect(card, context);
    }

    protected override effectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        return ['give {0} a {1} status token', [this.getProperties(context, additionalProperties).token]];
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnStatusTokenGained, C>, card: BaseCard, context: C, additionalProperties: ActionOverrides = {}): void {
        const { token } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.token = token;
    }

    override eventHandler(event: ActionEvent<EventName.OnStatusTokenGained, C>): void {
        if(event.token) {
            event.card.addStatusToken(event.token);
        }
    }
}
