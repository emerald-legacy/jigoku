import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../basecard.js';
import { CardTypes, EffectNames, Locations } from '../Constants.js';
import type DrawCard from '../drawcard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { Event } from '../Events/Event.js';
export interface MoveCardProperties extends CardActionProperties {
    destination?: Locations;
    switch?: boolean;
    switchTarget?: DrawCard;
    shuffle?: boolean;
    faceup?: boolean;
    bottom?: boolean;
    changePlayer?: boolean;
    discardDestinationCards?: boolean;
}

export class MoveCardAction extends CardGameAction {
    name = 'move';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Event, CardTypes.Holding];
    defaultProperties: MoveCardProperties = {
        destination: undefined,
        switch: false,
        switchTarget: undefined,
        shuffle: false,
        faceup: false,
        bottom: false,
        changePlayer: false,
        discardDestinationCards: false
    };
    constructor(properties: MoveCardProperties | ((context: AbilityContext) => MoveCardProperties)) {
        super(properties);
    }

    getCostMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as MoveCardProperties;
        return ['shuffling {0} into their deck', [properties.target]];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as MoveCardProperties;
        const target = properties.target as BaseCard | BaseCard[];
        let destinationController = Array.isArray(target)
            ? properties.changePlayer
                ? (target[0] as DrawCard).controller.opponent
                : (target[0] as DrawCard).controller
            : properties.changePlayer
                ? (target as DrawCard).controller.opponent
                : (target as DrawCard).controller;
        if(properties.shuffle) {
            return ['shuffle {0} into {1}\'s {2}', [properties.target, destinationController, properties.destination]];
        }
        return [
            'move {0} to ' + (properties.bottom ? 'the bottom of ' : '') + '{1}\'s {2}',
            [properties.target, destinationController, properties.destination]
        ];
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        const { changePlayer, destination } = this.getProperties(context, additionalProperties) as MoveCardProperties;
        return (
            (!changePlayer ||
                (card.checkRestrictions(EffectNames.TakeControl, context) &&
                    !(card as DrawCard).anotherUniqueInPlay(context.player))) &&
            (!destination || context.player.isLegalLocationForCard(card, destination)) &&
            card.location !== Locations.PlayArea &&
            super.canAffect(card, context)
        );
    }

    eventHandler(event: Event, additionalProperties = {}): void {
        let context = event.context!;
        let card = event.card;
        event.cardStateWhenMoved = card.createSnapshot();
        let properties = this.getProperties(context, additionalProperties) as MoveCardProperties;
        if(properties.switch && properties.switchTarget) {
            let otherCard = properties.switchTarget;
            card.owner.moveCard(otherCard, card.location);
        } else {
            this.checkForRefillProvince(card, event, additionalProperties);
        }
        const player = properties.changePlayer && card.controller.opponent ? card.controller.opponent : card.controller;
        if(
            properties.discardDestinationCards &&
            properties.destination &&
            context.game.getProvinceArray(false).includes(properties.destination)
        ) {
            let cardsToDiscard = player.getSourceList(properties.destination).filter((card: BaseCard) => (card as DrawCard).isDynasty);
            for(const card of cardsToDiscard) {
                player.moveCard(card, Locations.DynastyDiscardPile);
            }
        }
        player.moveCard(card, properties.destination, { bottom: !!properties.bottom });
        let target = properties.target as BaseCard | BaseCard[] | undefined;
        const targetArr = Array.isArray(target) ? target : target ? [target] : [];
        if(properties.shuffle && (targetArr.length === 0 || card === targetArr[targetArr.length - 1])) {
            if(properties.destination === Locations.ConflictDeck) {
                card.owner.shuffleConflictDeck();
            } else if(properties.destination === Locations.DynastyDeck) {
                card.owner.shuffleDynastyDeck();
            }
        } else if(properties.faceup) {
            card.facedown = false;
        }
        card.checkForIllegalAttachments();
    }
}
