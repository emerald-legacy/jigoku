import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardTypes, EffectNames, EventNames, Locations } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { Event } from '../Events/Event.js';
export interface PutInProvinceProperties extends CardActionProperties {
    destination?: Locations;
    switch?: boolean;
    switchTarget?: DrawCard;
    faceup?: boolean;
    changePlayer?: boolean;
    canBeStronghold?: boolean;
    discardDestinationCards?: boolean;
}

export class PutInProvinceAction extends CardGameAction {
    name = 'putInProvince';
    eventName = EventNames.OnCardLeavesPlay;
    targetType = [CardTypes.Character, CardTypes.Attachment];
    defaultProperties: PutInProvinceProperties = {
        destination: undefined,
        switch: false,
        switchTarget: undefined,
        faceup: true,
        canBeStronghold: false,
        changePlayer: false,
        discardDestinationCards: false
    };
    constructor(properties: PutInProvinceProperties | ((context: AbilityContext) => PutInProvinceProperties)) {
        super(properties);
    }

    getCostMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context) as PutInProvinceProperties;
        return ['putting {0} into {1}}', [properties.target, properties.destination]];
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context) as PutInProvinceProperties;
        const target = properties.target as BaseCard | BaseCard[];
        let destinationController = Array.isArray(target)
            ? properties.changePlayer
                ? target[0].controller.opponent
                : target[0].controller
            : properties.changePlayer
                ? target.controller.opponent
                : target.controller;
        return ['move {0} to {1}\'s {2}', [properties.target, destinationController, properties.destination]];
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        const { changePlayer, destination } = this.getProperties(
            context,
            additionalProperties
        ) as PutInProvinceProperties;
        const canMove =
            (!changePlayer || card.checkRestrictions(EffectNames.TakeControl, context)) &&
            (!destination || context.player.isLegalLocationForCard(card, destination)) &&
            card.location === Locations.PlayArea &&
            super.canAffect(card, context);
        return canMove;
    }

    eventHandler(event: Event, additionalProperties: Record<string, unknown> = {}): void {
        let context = event.context as AbilityContext;
        let card = event.card as DrawCard;
        event.cardStateWhenMoved = card.createSnapshot();
        let properties = this.getProperties(context, additionalProperties) as PutInProvinceProperties;
        if(properties.switch && properties.switchTarget) {
            let otherCard = properties.switchTarget;
            card.owner.moveCard(otherCard, card.location);
        }

        const player = card.owner;
        if(properties.destination && card.isConflict && [...context.game.getProvinceArray()].includes(properties.destination)) {
            context.game.addMessage('{0} is discarded instead since it can\'t enter a province legally!', card);
            properties.destination = Locations.ConflictDiscardPile;
        }
        if(
            properties.discardDestinationCards &&
            properties.destination &&
            context.game.getProvinceArray(false).includes(properties.destination)
        ) {
            let cardsToDiscard = player.getSourceList(properties.destination).filter((c) => c.isDynasty);
            for(const c of cardsToDiscard) {
                player.moveCard(c, Locations.DynastyDiscardPile);
            }
        }
        if(properties.destination) {
            player.moveCard(card, properties.destination);
        }
        if(properties.faceup) {
            card.facedown = false;
        }
        card.checkForIllegalAttachments();
    }
}
