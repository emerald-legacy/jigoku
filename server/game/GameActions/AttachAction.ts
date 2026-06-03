import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardTypes, EventNames, Locations } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
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

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
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

    checkEventCondition(event: GameEvent<EventNames.OnCardAttached>, additionalProperties: Record<string, unknown>): boolean {
        return this.canAffect(event.parent as DrawCard, (event.context as AbilityContext), additionalProperties);
    }

    isEventFullyResolved(event: GameEvent<EventNames.OnCardAttached>, card: DrawCard, context: AbilityContext, additionalProperties: Record<string, unknown>): boolean {
        let { attachment } = this.getProperties(context, additionalProperties);
        return event.parent === card && event.card === attachment && event.name === this.eventName && !event.cancelled;
    }

    addPropertiesToEvent(event: GameEvent<EventNames.OnCardAttached>, card: DrawCard, context: AbilityContext, additionalProperties: Record<string, unknown>): void {
        let { attachment } = this.getProperties(context, additionalProperties);
        event.name = this.eventName;
        event.parent = card;
        event.card = attachment as DrawCard;
        event.context = context;
    }

    eventHandler(event: GameEvent<EventNames.OnCardAttached>, additionalProperties = {}): void {
        const card = event.card as DrawCard;
        const parent = event.parent as DrawCard;
        const context = event.context as AbilityContext;
        const properties = this.getProperties(context, additionalProperties);
        event.originalLocation = card.location;
        if(card.location === Locations.PlayArea) {
            const currentParent = card.parent as DrawCard;
            currentParent.removeAttachment(card);
        } else {
            card.controller.removeCardFromPile(card);
            card.new = true;
            card.moveTo(Locations.PlayArea);
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
        if(parent.getType() === CardTypes.Province) {
            this.checkForRefillProvince(parent, event, additionalProperties);
        }
    }
}
