import type { MessageArgs } from '../GameChat.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CharacterStatus, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { StatusToken } from '../StatusToken.js';
import { TokenAction, type TokenActionProperties } from './TokenAction.js';

export interface MoveTokenProperties extends TokenActionProperties {
    recipient: DrawCard;
}

export class MoveTokenAction extends TokenAction<MoveTokenProperties, EventName.OnStatusTokenMoved> {
    name = 'moveStatusToken';
    eventName = EventName.OnStatusTokenMoved;

    getEffectMessage(context: AbilityContext, additionalProperties = {}): MessageArgs {
        const { target, recipient } = this.getProperties(context, additionalProperties) as MoveTokenProperties;
        let card = undefined;
        if(Array.isArray(target)) {
            card = (target[0] as StatusToken).card;
        } else {
            card = (target as StatusToken).card;
        }
        return ['move {0}\'s {1} to {2}', [card, target, recipient]];
    }

    canAffect(token: StatusToken, context: AbilityContext, additionalProperties = {}): boolean {
        const { recipient } = this.getProperties(context) as MoveTokenProperties;
        if(!recipient || recipient.location !== Location.PlayArea) {
            return false;
        } else if(
            token.grantedStatus === CharacterStatus.Honored &&
            (recipient.isHonored || !recipient.checkRestrictions('receiveHonorToken', context))
        ) {
            return false;
        } else if(
            token.grantedStatus === CharacterStatus.Dishonored &&
            (recipient.isDishonored || !recipient.checkRestrictions('receiveDishonorToken', context))
        ) {
            return false;
        } else if(
            token.grantedStatus === CharacterStatus.Tainted &&
            (recipient.isTainted || !recipient.checkRestrictions('receiveTaintedToken', context))
        ) {
            return false;
        }
        return super.canAffect(token, context, additionalProperties);
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnStatusTokenMoved>, token: StatusToken, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        const { recipient } = this.getProperties(context) as MoveTokenProperties;
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.recipient = recipient;
        event.donor = token.card ?? undefined;
    }

    eventHandler(event: GameEvent<EventName.OnStatusTokenMoved>): void {
        const eventToken = event.token as StatusToken | StatusToken[];
        const recipient = event.recipient as DrawCard;
        let tokens: StatusToken[] = Array.isArray(eventToken) ? eventToken : [eventToken];
        tokens.forEach((token: StatusToken) => {
            token.card?.removeStatusToken(token);
            recipient.addStatusToken(token);
            recipient.game.raiseEvent(EventName.OnStatusTokenGained, { token: token, card: recipient });
        });
    }
}
