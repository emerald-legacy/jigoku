import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EffectName, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { ActionEvent } from './GameAction.js';
export interface MoveCardProperties extends CardActionProperties {
    destination?: Location;
    switch?: boolean;
    switchTarget?: DrawCard;
    shuffle?: boolean;
    faceup?: boolean;
    bottom?: boolean;
    changePlayer?: boolean;
    discardDestinationCards?: boolean;
}

export class MoveCardAction<C extends AbilityContext = AbilityContext> extends CardGameAction<MoveCardProperties, EventName, C> {
    name = 'move';
    targetType = [CardType.Character, CardType.Attachment, CardType.Event, CardType.Holding];
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
    constructor(properties: MoveCardProperties | ((context: C) => MoveCardProperties)) {
        super(properties);
    }

    getCostMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['shuffling {0} into their deck', [properties.target]];
    }

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        const target = properties.target;
        let destinationController = Array.isArray(target)
            ? properties.changePlayer
                ? target[0].controller.opponent
                : target[0].controller
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

    canAffect(card: BaseCard, context: C, additionalProperties = {}): boolean {
        const { changePlayer, destination } = this.getProperties(context, additionalProperties);
        return (
            (!changePlayer ||
                (card.checkRestrictions(EffectName.TakeControl, context) &&
                    !(card as DrawCard).anotherUniqueInPlay(context.player))) &&
            (!destination || context.player.isLegalLocationForCard(card, destination)) &&
            card.location !== Location.PlayArea &&
            super.canAffect(card, context)
        );
    }

    eventHandler(event: ActionEvent<EventName.Unnamed, C>, additionalProperties = {}): void {
        let context = event.context;
        let card = event.card as DrawCard;
        event.cardStateWhenMoved = card.createSnapshot();
        let properties = this.getProperties(context, additionalProperties);
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
            let cardsToDiscard = player.getSourceList(properties.destination).filter((card: BaseCard) => card.isDynasty);
            for(const card of cardsToDiscard) {
                player.moveCard(card, Location.DynastyDiscardPile);
            }
        }
        player.moveCard(card, properties.destination as Location, { bottom: !!properties.bottom });
        let target = properties.target;
        const targetArr = Array.isArray(target) ? target : target ? [target] : [];
        if(properties.shuffle && (targetArr.length === 0 || card === targetArr[targetArr.length - 1])) {
            if(properties.destination === Location.ConflictDeck) {
                card.owner.shuffleConflictDeck();
            } else if(properties.destination === Location.DynastyDeck) {
                card.owner.shuffleDynastyDeck();
            }
        } else if(properties.faceup) {
            card.facedown = false;
        }
        card.checkForIllegalAttachments();
    }
}
