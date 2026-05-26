import type { AbilityContext } from '../AbilityContext.js';
import { EventNames, Locations } from '../Constants.js';
import type Player from '../player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { shuffle } from '../utils/shuffle.js';

export interface RandomDiscardProperties extends PlayerActionProperties {
    amount?: number;
}

export class RandomDiscardAction extends PlayerAction {
    defaultProperties: RandomDiscardProperties = { amount: 1 };

    name = 'discard';
    eventName = EventNames.OnCardsDiscardedFromHand;
    constructor(propertyFactory: RandomDiscardProperties | ((context: AbilityContext) => RandomDiscardProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: RandomDiscardProperties = this.getProperties(context);
        return [
            'make {0} discard {1} {2} at random',
            [properties.target, properties.amount, (properties.amount ?? 0) > 1 ? 'cards' : 'card']
        ];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: RandomDiscardProperties = this.getProperties(context, additionalProperties);
        return (properties.amount ?? 0) > 0 && player.hand.length > 0 && super.canAffect(player, context);
    }

    addPropertiesToEvent(event: any, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { amount } = this.getProperties(context, additionalProperties) as RandomDiscardProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.discardedAtRandom = true;
    }

    eventHandler(event: any): void {
        let player = event.player;
        let amount = Math.min(event.amount, player.hand.length);
        if(amount === 0) {
            return;
        }
        let cardsToDiscard = shuffle(player.hand).slice(0, amount) as typeof player.hand;
        event.cards = cardsToDiscard;
        event.discardedCards = cardsToDiscard;
        player.game.addMessage('{0} discards {1} at random', player, cardsToDiscard);

        for(const card of cardsToDiscard) {
            player.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
        }
    }
}
