import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CharacterStatus, EventName, Location, RestrictionType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { StatusToken } from '../StatusToken.js';
import { TokenAction, type TokenActionProperties } from './TokenAction.js';
import { targetList, type ActionEvent } from './GameAction.js';

export interface MoveTokenProperties extends TokenActionProperties {
    recipient: DrawCard;
}

export class MoveStatusTokenAction<C extends AbilityContext = AbilityContext> extends TokenAction<MoveTokenProperties, EventName.OnStatusTokenMoved, C> {
    name = 'moveStatusToken';
    eventName = EventName.OnStatusTokenMoved;

    protected effectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { target, recipient } = this.getProperties(context, additionalProperties);
        return ['move {0}\'s {1} to {2}', [target, recipient]];
    }

    protected effectMessageTarget(context: C, additionalProperties: ActionOverrides = {}): MsgArg {
        return targetList(this.getProperties(context, additionalProperties).target)[0].card;
    }

    canAffect(token: StatusToken, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { recipient } = this.getProperties(context);
        if(recipient.location !== Location.PlayArea) {
            return false;
        } else if(
            token.grantedStatus === CharacterStatus.Honored &&
            (recipient.isHonored || !recipient.checkRestrictions(RestrictionType.ReceiveHonorToken, context))
        ) {
            return false;
        } else if(
            token.grantedStatus === CharacterStatus.Dishonored &&
            (recipient.isDishonored || !recipient.checkRestrictions(RestrictionType.ReceiveDishonorToken, context))
        ) {
            return false;
        } else if(
            token.grantedStatus === CharacterStatus.Tainted &&
            (recipient.isTainted || !recipient.checkRestrictions(RestrictionType.ReceiveTaintedToken, context))
        ) {
            return false;
        }
        return super.canAffect(token, context, additionalProperties);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnStatusTokenMoved, C>, token: StatusToken, context: C, additionalProperties: ActionOverrides = {}): void {
        const { recipient } = this.getProperties(context);
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.recipient = recipient;
        event.donor = token.card ?? undefined;
    }

    eventHandler(event: ActionEvent<EventName.OnStatusTokenMoved, C>): void {
        const token = event.token;
        const recipient = event.recipient;
        token.card?.removeStatusToken(token);
        recipient.addStatusToken(token);
        recipient.game.raiseEvent(EventName.OnStatusTokenGained, { token: token, card: recipient });
    }
}
