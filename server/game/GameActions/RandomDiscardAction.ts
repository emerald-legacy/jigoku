import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, Location } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { shuffle } from '../utils/shuffle.js';
import type { ActionEvent } from './GameAction.js';

export interface RandomDiscardProperties extends PlayerActionProperties {
    amount?: number;
}

export class RandomDiscardAction<C extends AbilityContext = AbilityContext> extends PlayerAction<RandomDiscardProperties, EventName, C> {
    defaultProperties: RandomDiscardProperties = { amount: 1 };

    name = 'discard';
    eventName = EventName.OnCardsDiscardedFromHand;
    constructor(propertyFactory: RandomDiscardProperties | ((context: C) => RandomDiscardProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: C): MessageArgs {
        let properties: RandomDiscardProperties = this.getProperties(context);
        return [
            'make {0} discard {1} {2} at random',
            [properties.target, properties.amount, (properties.amount ?? 0) > 1 ? 'cards' : 'card']
        ];
    }

    canAffect(player: Player, context: C, additionalProperties = {}): boolean {
        let properties: RandomDiscardProperties = this.getProperties(context, additionalProperties);
        return (properties.amount ?? 0) > 0 && player.hand.length > 0 && super.canAffect(player, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnCardsDiscardedFromHand, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.discardedAtRandom = true;
    }

    eventHandler(event: ActionEvent<EventName.OnCardsDiscardedFromHand, C>): void {
        let player = event.player as Player;
        let amount = Math.min(event.amount as number, player.hand.length);
        if(amount === 0) {
            return;
        }
        let cardsToDiscard = shuffle(player.hand).slice(0, amount);
        event.cards = cardsToDiscard;
        event.discardedCards = cardsToDiscard;
        player.game.addMessage('{0} discards {1} at random', player, cardsToDiscard);

        for(const card of cardsToDiscard) {
            player.moveCard(card, card.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile);
        }
    }
}
