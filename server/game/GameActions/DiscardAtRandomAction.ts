import type { ActionOverrides } from './GameAction.js';
import { msg, type MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, Location, RestrictionType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { shuffle } from '../utils/random.js';
import type { ActionEvent } from './GameAction.js';

export interface RandomDiscardProperties extends PlayerActionProperties {
    amount?: number;
}

/** A discard event this action created: `addPropertiesToEvent` always sets its amount. */
type RandomDiscardEvent<C extends AbilityContext> = ActionEvent<EventName.OnCardsDiscardedFromHand, C> & { amount: number };

export class DiscardAtRandomAction<C extends AbilityContext = AbilityContext> extends PlayerAction<RandomDiscardProperties, EventName.OnCardsDiscardedFromHand, C, 'amount'> {
    defaultProperties = { amount: 1 };

    name = 'discardAtRandom';

    restriction = RestrictionType.Discard;
    eventName = EventName.OnCardsDiscardedFromHand;
    protected effectMessage(context: C): MessageArgs {
        const { amount } = this.getProperties(context);
        return ['make {0} discard {1} {2} at random', [amount, amount > 1 ? 'cards' : 'card']];
    }

    canAffect(player: Player, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.amount > 0 && player.hand.length > 0 && super.canAffect(player, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnCardsDiscardedFromHand, C>, player: Player, context: C, additionalProperties: ActionOverrides = {}): void {
        const { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.discardedAtRandom = true;
    }

    eventHandler(event: RandomDiscardEvent<C>): void {
        const player = event.player;
        const amount = Math.min(event.amount, player.hand.length);
        if(amount === 0) {
            return;
        }
        const cardsToDiscard = shuffle(player.hand).slice(0, amount);
        event.cards = cardsToDiscard;
        event.discardedCards = cardsToDiscard;
        player.game.addMessage(msg`${player} discards ${cardsToDiscard} at random`);

        for(const card of cardsToDiscard) {
            player.moveCard(card, card.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile);
        }
    }
}
