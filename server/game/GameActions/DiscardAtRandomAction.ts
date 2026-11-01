import type { ActionOverrides } from './GameAction.js';
import { msg, type MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, Location, RestrictionType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { shuffle } from '../utils/random.js';
import { targetList, type ActionEvent } from './GameAction.js';

export interface RandomDiscardProperties extends PlayerActionProperties {
    amount?: number;
}

/** A discard event this action created: `addPropertiesToEvent` always sets its amount. */
type RandomDiscardEvent<Context extends AbilityContext> = ActionEvent<EventName.OnCardsDiscardedFromHand, Context> & { amount: number };

export class DiscardAtRandomAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<RandomDiscardProperties, EventName.OnCardsDiscardedFromHand, Context, 'amount'> {
    override defaultProperties = { amount: 1 };

    override defaultTargets(context: Context): Player[] {
        return this.opponentTargets(context);
    }

    override name = 'discardAtRandom';

    override restriction = RestrictionType.Discard;
    override eventName = EventName.OnCardsDiscardedFromHand;
    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { amount, target } = this.getProperties(context, additionalProperties);
        const [player] = targetList(target);
        const count = player ? Math.min(amount, player.hand.length) : amount;
        return ['make {0} discard {1} {2} at random', [count, count > 1 ? 'cards' : 'card']];
    }

    override canAffect(player: Player, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.amount > 0 && player.hand.length > 0 && super.canAffect(player, context);
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnCardsDiscardedFromHand, Context>, player: Player, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.discardedAtRandom = true;
    }

    override eventHandler(event: RandomDiscardEvent<Context>): void {
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
