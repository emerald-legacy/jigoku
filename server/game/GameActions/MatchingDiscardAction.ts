import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventNames, Locations } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

export interface MatchingDiscardProperties extends PlayerActionProperties {
    amount?: number;
    reveal?: boolean;
    cards?: BaseCard[];
    match?: (context: AbilityContext, card: BaseCard) => boolean;
}

export class MatchingDiscardAction extends PlayerAction {
    defaultProperties: MatchingDiscardProperties = {
        amount: -1,
        reveal: false,
        cards: undefined,
        match: () => true
    };

    name = 'discard';
    eventName = EventNames.OnCardsDiscardedFromHand;
    constructor(propertyFactory: MatchingDiscardProperties | ((context: AbilityContext) => MatchingDiscardProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let properties: MatchingDiscardProperties = this.getProperties(context) as MatchingDiscardProperties;
        return ['make {0} discard all cards that match a condition', [properties.target]];
    }

    canAffect(player: Player, context: AbilityContext, _additionalProperties = {}): boolean {
        return player.hand.length > 0 && super.canAffect(player, context);
    }

    addPropertiesToEvent(event: Event, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let properties: MatchingDiscardProperties = this.getProperties(
            context,
            additionalProperties
        ) as MatchingDiscardProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = properties.amount;
        event.reveal = properties.reveal;
        event.cards = properties.cards;
        event.match = properties.match;
    }

    eventHandler(event: Event): void {
        let context = event.context as AbilityContext;
        let player = event.player as Player;
        let amount = Math.min(event.amount, player.hand.length);
        if(amount < 0) {
            amount = player.hand.length;
        }

        if(amount === 0) {
            return;
        }
        let cards = event.cards as BaseCard[];
        let cardsToDiscard = cards.filter((a: BaseCard) => event.match(context, a));
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
            player.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
        }
    }
}
