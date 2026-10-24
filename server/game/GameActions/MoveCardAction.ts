import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, type EventName, Location, RestrictionType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { type CardActionProperties, type CardEvent, CardGameAction } from './CardGameAction.js';
import { targetList } from './GameAction.js';

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

export class MoveCardAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<
    MoveCardProperties,
    EventName.Unnamed,
    Context,
    'switch' | 'shuffle' | 'faceup' | 'bottom' | 'changePlayer' | 'discardDestinationCards'
> {
    override name = 'moveCard';
    override restriction = RestrictionType.Move;
    override targetType = [CardType.Character, CardType.Attachment, CardType.Event, CardType.Holding];
    override defaultProperties = {
        switch: false,
        shuffle: false,
        faceup: false,
        bottom: false,
        changePlayer: false,
        discardDestinationCards: false
    };

    override getCostMessage(context: Context): MessageArgs {
        const properties = this.getProperties(context);
        return ['shuffling {0} into their deck', [properties.target]];
    }

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const properties = this.getProperties(context, additionalProperties);
        const [target] = targetList(properties.target);
        const destinationController = properties.changePlayer ? target.controller.opponent : target.controller;
        if(properties.shuffle) {
            return ['shuffle {0} into {1}\'s {2}', [destinationController, properties.destination]];
        }
        return [
            'move {0} to ' + (properties.bottom ? 'the bottom of ' : '') + '{1}\'s {2}',
            [destinationController, properties.destination]
        ];
    }

    override canAffect(card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { changePlayer, destination } = this.getProperties(context, additionalProperties);
        return (
            (!changePlayer ||
                (card.checkRestrictions(RestrictionType.TakeControl, context) &&
                    !(card.isDrawCard() && card.anotherUniqueInPlay(context.player)))) &&
            (!destination || context.player.isLegalLocationForCard(card, destination)) &&
            (destination !== Location.Hand || card.checkRestrictions(RestrictionType.MoveToHand, context)) &&
            card.location !== Location.PlayArea &&
            !(card.isDrawCard() && card.isRemovedByEphemeral()) &&
            super.canAffect(card, context)
        );
    }

    override eventHandler(event: CardEvent<EventName.Unnamed, Context>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const card = event.card;
        if(card.isDrawCard()) {
            event.cardStateWhenMoved = card.createSnapshot();
        }
        const properties = this.getProperties(context, additionalProperties);
        if(properties.switch && properties.switchTarget) {
            const otherCard = properties.switchTarget;
            card.owner.moveCard(otherCard, card.location);
        } else {
            this.checkForRefillProvince(card, event, additionalProperties);
        }
        // a played event is controlled by the player playing it, its owner or not
        const player = properties.destination === Location.BeingPlayed
            ? context.player
            : properties.changePlayer && card.controller.opponent ? card.controller.opponent : card.controller;
        if(
            properties.discardDestinationCards &&
            properties.destination &&
            context.game.getProvinceArray(false).includes(properties.destination)
        ) {
            const cardsToDiscard = player.getSourceList(properties.destination).filter((card: BaseCard) => card.isDynasty);
            for(const card of cardsToDiscard) {
                player.moveCard(card, Location.DynastyDiscardPile);
            }
        }
        if(properties.destination) {
            player.moveCard(card, properties.destination, { bottom: properties.bottom });
        }
        const targetArr = targetList(properties.target);
        if(properties.shuffle && (targetArr.length === 0 || card === targetArr[targetArr.length - 1])) {
            if(properties.destination) {
                card.owner.shuffleDeck(properties.destination);
            }
        } else if(properties.faceup) {
            card.facedown = false;
        }
        card.checkForIllegalAttachments();
    }
}
