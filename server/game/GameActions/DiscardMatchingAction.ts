import type { ActionOverrides } from './GameAction.js';
import { msg, type MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName, Location, RestrictionType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface MatchingDiscardProperties extends PlayerActionProperties {
    amount?: number;
    reveal?: boolean;
    cards?: BaseCard[];
    match?: (context: AbilityContext, card: BaseCard) => boolean;
}

/** A discard event this action created: `addPropertiesToEvent` always sets its amount and match. */
type MatchingDiscardEvent<C extends AbilityContext> = ActionEvent<EventName.OnCardsDiscardedFromHand, C> & {
    amount: number;
    match: (context: AbilityContext, card: BaseCard) => boolean;
};

export class DiscardMatchingAction<C extends AbilityContext = AbilityContext> extends PlayerAction<MatchingDiscardProperties, EventName.OnCardsDiscardedFromHand, C, 'amount' | 'reveal' | 'match'> {
    defaultProperties = {
        amount: -1,
        reveal: false,
        match: () => true
    };

    name = 'discard';

    restriction = RestrictionType.Discard;
    eventName = EventName.OnCardsDiscardedFromHand;

    protected effectMessage(): MessageArgs {
        return ['make {0} discard all cards that match a condition', []];
    }

    canAffect(player: Player, context: C, _additionalProperties = {}): boolean {
        return player.hand.length > 0 && super.canAffect(player, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnCardsDiscardedFromHand, C>, player: Player, context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(
            context,
            additionalProperties
        );
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = properties.amount;
        event.reveal = properties.reveal;
        event.cards = properties.cards;
        event.match = properties.match;
    }

    eventHandler(event: MatchingDiscardEvent<C>): void {
        const context = event.context;
        const player = event.player;
        let amount = Math.min(event.amount, player.hand.length);
        if(amount < 0) {
            amount = player.hand.length;
        }

        if(amount === 0) {
            return;
        }
        const cards = event.cards ?? [];
        let cardsToDiscard = cards.filter((a: BaseCard) => event.match(context, a));
        if(amount < cardsToDiscard.length) {
            cardsToDiscard = cardsToDiscard.slice(0, amount);
        }
        event.cards = cardsToDiscard;
        event.discardedCards = cardsToDiscard;
        if(event.reveal) {
            player.game.addMessage(msg`${player} reveals ${cards}`);
        }
        if(cardsToDiscard.length > 0) {
            player.game.addMessage(msg`${player} discards ${cardsToDiscard}`);
        } else {
            player.game.addMessage(msg`${player} does not discard anything`);
        }

        for(const card of cardsToDiscard) {
            player.moveCard(card, card.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile);
        }
    }
}
