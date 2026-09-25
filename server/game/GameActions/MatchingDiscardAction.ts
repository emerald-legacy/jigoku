import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName, Location } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface MatchingDiscardProperties extends PlayerActionProperties {
    amount?: number;
    reveal?: boolean;
    cards?: BaseCard[];
    match?: (context: AbilityContext, card: BaseCard) => boolean;
}

export class MatchingDiscardAction<C extends AbilityContext = AbilityContext> extends PlayerAction<MatchingDiscardProperties, EventName.OnCardsDiscardedFromHand, C> {
    defaultProperties: MatchingDiscardProperties = {
        amount: -1,
        reveal: false,
        cards: undefined,
        match: () => true
    };

    name = 'discard';
    eventName = EventName.OnCardsDiscardedFromHand;
    constructor(propertyFactory: MatchingDiscardProperties | ((context: C) => MatchingDiscardProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: C): MessageArgs {
        let properties: MatchingDiscardProperties = this.getProperties(context);
        return ['make {0} discard all cards that match a condition', [properties.target]];
    }

    canAffect(player: Player, context: C, _additionalProperties = {}): boolean {
        return player.hand.length > 0 && super.canAffect(player, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnCardsDiscardedFromHand, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let properties: MatchingDiscardProperties = this.getProperties(
            context,
            additionalProperties
        );
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = properties.amount;
        event.reveal = properties.reveal;
        event.cards = properties.cards;
        event.match = properties.match;
    }

    eventHandler(event: ActionEvent<EventName.OnCardsDiscardedFromHand, C>): void {
        let context = event.context;
        let player = event.player as Player;
        let amount = Math.min(event.amount ?? -1, player.hand.length);
        if(amount < 0) {
            amount = player.hand.length;
        }

        if(amount === 0) {
            return;
        }
        let cards = event.cards as BaseCard[];
        const match = event.match ?? (() => true);
        let cardsToDiscard = cards.filter((a: BaseCard) => match(context, a));
        if(amount < cardsToDiscard.length) {
            cardsToDiscard = cardsToDiscard.slice(0, amount);
        }
        event.cards = cardsToDiscard;
        event.discardedCards = cardsToDiscard;
        if(event.reveal) {
            player.game.addMessage('{0} reveals {1}', player, cards);
        }
        if(cardsToDiscard.length > 0) {
            player.game.addMessage('{0} discards {1}', player, cardsToDiscard);
        } else {
            player.game.addMessage('{0} does not discard anything', player);
        }

        for(const card of cardsToDiscard) {
            player.moveCard(card, card.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile);
        }
    }
}
