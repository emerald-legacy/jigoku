import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CharacterStatus, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { StatusToken } from '../StatusToken.js';
import { TokenAction, type TokenActionProperties } from './TokenAction.js';
import type { ActionEvent } from './GameAction.js';

export interface MoveTokenProperties extends TokenActionProperties {
    recipient: DrawCard;
}

export class MoveTokenAction<C extends AbilityContext = AbilityContext> extends TokenAction<MoveTokenProperties, EventName.OnStatusTokenMoved, C> {
    name = 'moveStatusToken';
    eventName = EventName.OnStatusTokenMoved;

    getEffectMessage(context: C, additionalProperties = {}): MessageArgs {
        const { target, recipient } = this.getProperties(context, additionalProperties);
        let card = undefined;
        if(Array.isArray(target)) {
            card = (target[0]).card;
        } else {
            card = (target as StatusToken).card;
        }
        return ['move {0}\'s {1} to {2}', [card, target, recipient]];
    }

    canAffect(token: StatusToken, context: C, additionalProperties = {}): boolean {
        const { recipient } = this.getProperties(context);
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

    addPropertiesToEvent(event: ActionEvent<EventName.OnStatusTokenMoved, C>, token: StatusToken, context: C, additionalProperties: Record<string, unknown> = {}): void {
        const { recipient } = this.getProperties(context);
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.recipient = recipient;
        event.donor = token.card ?? undefined;
    }

    eventHandler(event: ActionEvent<EventName.OnStatusTokenMoved, C>): void {
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
