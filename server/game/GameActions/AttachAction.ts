import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../basecard.js';
import { CardTypes, EventNames, Locations } from '../Constants.js';
import type DrawCard from '../drawcard.js';
import type Player from '../player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { Event } from '../Events/Event.js';
export interface AttachActionProperties extends CardActionProperties {
    attachment?: DrawCard;
    ignoreType?: boolean;
    takeControl?: boolean;
    giveControl?: boolean;
    ignoreUniqueness?: boolean;
    viaDisguised?: boolean;
    controlSwitchOptional?: boolean;
}

export class AttachAction extends CardGameAction<AttachActionProperties> {
    name = 'attach';
    eventName = EventNames.OnCardAttached;
    targetType = [CardTypes.Character, CardTypes.Province];
    defaultProperties: AttachActionProperties = {
        ignoreType: false,
        takeControl: false,
        giveControl: false,
        controlSwitchOptional: false,
        ignoreUniqueness: false,
        viaDisguised: false
    };

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context);
        if(properties.takeControl) {
            return [
                'take control of and attach {2}\'s {1} to {0}',
                [properties.target, properties.attachment, (properties.attachment as DrawCard).parent]
            ];
        } else if(properties.giveControl) {
            return [
                'give control of and attach {2}\'s {1} to {0}',
                [properties.target, properties.attachment, (properties.attachment as DrawCard).parent]
            ];
        }
        return ['attach {1} to {0}', [properties.target, properties.attachment]];
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        let canAttachProps = {
            ignoreType: !!properties.ignoreType,
            controller: this.getFinalController(properties, context) as Player
        };
        if(properties.viaDisguised) {
            return true;
        }

        if(
            !context ||
            !context.player ||
            !card ||
            (card.location !== Locations.PlayArea && card.type !== CardTypes.Province)
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

    getFinalController(properties: AttachActionProperties, context: AbilityContext): Player {
        if(properties.takeControl) {
            return context.player;
        } else if(properties.giveControl) {
            return context.player.opponent as Player;
        }

        return (properties.attachment as DrawCard).controller;
    }

    checkEventCondition(event: Event, additionalProperties: any): boolean {
        return this.canAffect(event.parent, event.context!, additionalProperties);
    }

    isEventFullyResolved(event: Event, card: DrawCard, context: AbilityContext, additionalProperties: any): boolean {
        let { attachment } = this.getProperties(context, additionalProperties);
        return event.parent === card && event.card === attachment && event.name === this.eventName && !event.cancelled;
    }

    addPropertiesToEvent(event: Event, card: DrawCard, context: AbilityContext, additionalProperties: any): void {
        let { attachment } = this.getProperties(context, additionalProperties);
        event.name = this.eventName;
        event.parent = card;
        event.card = attachment;
        event.context = context;
    }

    eventHandler(event: Event, additionalProperties = {}): void {
        let properties = this.getProperties(event.context!, additionalProperties);
        event.originalLocation = event.card.location;
        if(event.card.location === Locations.PlayArea) {
            event.card.parent.removeAttachment(event.card);
        } else {
            event.card.controller.removeCardFromPile(event.card);
            event.card.new = true;
            event.card.moveTo(Locations.PlayArea);
        }
        event.parent.attachments.push(event.card);
        event.card.parent = event.parent;
        if(properties.takeControl) {
            event.card.controller = event.context!.player;
            event.card.updateEffectContexts();
        } else if(properties.giveControl) {
            event.card.controller = event.context!.player.opponent;
            event.card.updateEffectContexts();
        }
        if(event.card.parent.getType() === CardTypes.Province) {
            this.checkForRefillProvince(event.card.parent, event, additionalProperties);
        }
    }
}
