import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { ActionEvent } from './GameAction.js';
export interface AttachActionProperties extends CardActionProperties {
    attachment?: DrawCard;
    ignoreType?: boolean;
    takeControl?: boolean;
    giveControl?: boolean;
    ignoreUniqueness?: boolean;
    viaDisguised?: boolean;
    controlSwitchOptional?: boolean;
    wasACharacter?: boolean;
}

export class AttachAction<C extends AbilityContext = AbilityContext> extends CardGameAction<AttachActionProperties, EventName, C> {
    name = 'attach';
    eventName = EventName.OnCardAttached;
    targetType = [CardType.Character, CardType.Province];
    defaultProperties: AttachActionProperties = {
        ignoreType: false,
        takeControl: false,
        giveControl: false,
        controlSwitchOptional: false,
        ignoreUniqueness: false,
        viaDisguised: false,
        wasACharacter: false
    };

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        if(properties.takeControl) {
            return [
                'take control of and attach {2}\'s {1} to {0}',
                [properties.target, properties.attachment, properties.attachment?.parent]
            ];
        } else if(properties.giveControl) {
            return [
                'give control of and attach {2}\'s {1} to {0}',
                [properties.target, properties.attachment, properties.attachment?.parent]
            ];
        }
        return ['attach {1} to {0}', [properties.target, properties.attachment]];
    }

    canAffect(card: BaseCard, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        let canAttachProps = {
            ignoreType: !!properties.ignoreType,
            controller: this.getFinalController(properties, context)
        };
        if(properties.viaDisguised) {
            return true;
        }

        if(
            !context ||
            !context.player ||
            !card ||
            (card.location !== Location.PlayArea && card.type !== CardType.Province)
        ) {
            return false;
        } else if(
            !properties.attachment ||
            (!properties.ignoreUniqueness && properties.attachment.anotherUniqueInPlay(context.player)) ||
            !properties.attachment.canAttach(card, canAttachProps)
        ) {
            return false;
        } else if(
            !properties.controlSwitchOptional &&
            properties.takeControl &&
            properties.attachment.controller === context.player
        ) {
            return false;
        } else if(
            !properties.controlSwitchOptional &&
            properties.giveControl &&
            properties.attachment.controller !== context.player
        ) {
            return false;
        } else if(!card.checkRestrictions('play', context)) {
            return false;
        }
        return card.allowAttachment(properties.attachment) && super.canAffect(card, context);
    }

    getFinalController(properties: AttachActionProperties, context: C): Player {
        if(properties.takeControl) {
            return context.player;
        } else if(properties.giveControl) {
            return context.player.opponent as Player;
        }

        return (properties.attachment as DrawCard)?.controller ?? context.player;
    }

    checkEventCondition(event: ActionEvent<EventName.OnCardAttached, C>, additionalProperties: Record<string, unknown>): boolean {
        return this.canAffect(event.parent as DrawCard, (event.context), additionalProperties);
    }

    isEventFullyResolved(event: ActionEvent<EventName.OnCardAttached, C>, card: DrawCard, context: C, additionalProperties: Record<string, unknown>): boolean {
        let { attachment } = this.getProperties(context, additionalProperties);
        return event.parent === card && event.card === attachment && event.name === this.eventName && !event.cancelled;
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnCardAttached, C>, card: DrawCard, context: C, additionalProperties: Record<string, unknown>): void {
        let { attachment } = this.getProperties(context, additionalProperties);
        event.name = this.eventName;
        event.parent = card;
        event.card = attachment as DrawCard;
        event.context = context;
    }

    eventHandler(event: ActionEvent<EventName.OnCardAttached, C>, additionalProperties = {}): void {
        const card = event.card as DrawCard;
        const parent = event.parent as BaseCard;
        const context = event.context;
        const properties = this.getProperties(context, additionalProperties);
        event.originalLocation = card.location;

        if(card.location === Location.PlayArea && !properties.wasACharacter) {
            card.parent?.removeAttachment(card);
        } else {
            card.controller.removeCardFromPile(card);
            card.new = true;
            card.moveTo(Location.PlayArea);
        }
        parent.attachments.push(card);
        card.parent = parent;
        if(properties.takeControl) {
            card.controller = context.player;
            card.updateEffectContexts();
        } else if(properties.giveControl) {
            card.controller = context.player.opponent as Player;
            card.updateEffectContexts();
        }
        if(parent.getType() === CardType.Province) {
            this.checkForRefillProvince(parent, event, additionalProperties);
        }
    }
}
