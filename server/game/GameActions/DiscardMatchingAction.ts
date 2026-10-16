import type { ActionOverrides } from './GameAction.js';
import { msg, type MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName, Location, RestrictionType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface MatchingDiscardProperties<Context extends AbilityContext = AbilityContext> extends PlayerActionProperties {
    amount?: number;
    reveal?: boolean;
    cards?: BaseCard[];
    match?(context: Context, card: BaseCard): boolean;
}

/** A discard event this action created: `addPropertiesToEvent` always sets its amount and match. */
type MatchingDiscardEvent<Context extends AbilityContext> = ActionEvent<EventName.OnCardsDiscardedFromHand, Context> & {
    amount: number;
    match: (context: AbilityContext, card: BaseCard) => boolean;
};

export class DiscardMatchingAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<MatchingDiscardProperties, EventName.OnCardsDiscardedFromHand, Context, 'amount' | 'reveal' | 'match'> {
    override defaultProperties = {
        amount: -1,
        reveal: false,
        match: () => true
    };

    override defaultTargets(context: Context): Player[] {
        return this.opponentTargets(context);
    }

    override name = 'discardMatching';

    override restriction = RestrictionType.Discard;
    override eventName = EventName.OnCardsDiscardedFromHand;

    protected override effectMessage(): MessageArgs {
        return ['make {0} discard all cards that match a condition', []];
    }

    override canAffect(player: Player, context: Context, _additionalProperties = {}): boolean {
        return player.hand.length > 0 && super.canAffect(player, context);
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnCardsDiscardedFromHand, Context>, player: Player, context: Context, additionalProperties: ActionOverrides = {}): void {
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

    override eventHandler(event: MatchingDiscardEvent<Context>): void {
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
