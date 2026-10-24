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

export class MoveStatusTokenAction<Context extends AbilityContext = AbilityContext> extends TokenAction<MoveTokenProperties, EventName.OnStatusTokenMoved, Context> {
    override name = 'moveStatusToken';
    override eventName = EventName.OnStatusTokenMoved;

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { target, recipient } = this.getProperties(context, additionalProperties);
        return ['move {0}\'s {1} to {2}', [target, recipient]];
    }

    protected override effectMessageTarget(context: Context, additionalProperties: ActionOverrides = {}): MsgArg {
        return targetList(this.getProperties(context, additionalProperties).target)[0].card;
    }

    override canAffect(token: StatusToken, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { recipient } = this.getProperties(context, additionalProperties);
        if(recipient.location !== Location.PlayArea) {
            return false;
        } else if(
            token.grantedStatus === CharacterStatus.Honored &&
            (recipient.isHonored ||
                !recipient.checkRestrictions(RestrictionType.ReceiveHonorToken, context) ||
                !recipient.checkRestrictions(RestrictionType.Honor, context))
        ) {
            return false;
        } else if(
            token.grantedStatus === CharacterStatus.Dishonored &&
            (recipient.isDishonored ||
                !recipient.checkRestrictions(RestrictionType.ReceiveDishonorToken, context) ||
                !recipient.checkRestrictions(RestrictionType.Dishonor, context))
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

    override addPropertiesToEvent(event: ActionEvent<EventName.OnStatusTokenMoved, Context>, token: StatusToken, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { recipient } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.recipient = recipient;
        event.donor = token.card ?? undefined;
    }

    override eventHandler(event: ActionEvent<EventName.OnStatusTokenMoved, Context>): void {
        const token = event.token;
        const recipient = event.recipient;
        token.card?.removeStatusToken(token);
        recipient.addStatusToken(token);
        recipient.game.raiseEvent(EventName.OnStatusTokenGained, { token: token, card: recipient });
    }
}
