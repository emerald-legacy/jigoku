import type { ActionOverrides } from './GameAction.js';
import { msg, type MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName, Location, Players, TargetMode, RestrictionType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { targetList, type ActionEvent } from './GameAction.js';

export interface ChosenDiscardProperties<Context extends AbilityContext = AbilityContext> extends PlayerActionProperties {
    amount?: number;
    targets?: boolean;
    cardCondition?(card: BaseCard, context: Context): boolean;
}

export class ChosenDiscardAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<ChosenDiscardProperties, EventName.OnCardsDiscardedFromHand, Context, 'amount' | 'targets' | 'cardCondition'> {
    override defaultProperties = {
        amount: 1,
        targets: true,
        cardCondition: () => true
    };
    override name = 'chosenDiscard';
    override restriction = RestrictionType.Discard;
    override eventName = EventName.OnCardsDiscardedFromHand;

    override defaultTargets(context: Context): Player[] {
        return this.opponentTargets(context);
    }

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { amount } = this.getProperties(context, additionalProperties);
        return [amount === 1 ? 'make {0} discard {1} card' : 'make {0} discard {1} cards', [amount]];
    }

    override canAffect(player: Player, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        const availableHand = player.hand.filter((card) => properties.cardCondition(card, context));

        if(availableHand.length === 0 || properties.amount === 0) {
            return false;
        }
        return super.canAffect(player, context);
    }

    override addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        for(const player of targetList(properties.target)) {
            const availableHand = player.hand.filter((card) => properties.cardCondition(card, context));
            const amount = Math.min(availableHand.length, properties.amount);
            if(amount > 0) {
                if(amount >= availableHand.length) {
                    const event = this.getEvent(player, context, additionalProperties);
                    event.cards = availableHand;
                    events.push(event);
                    continue;
                }

                if(properties.targets && context.choosingPlayerOverride && context.choosingPlayerOverride !== player) {
                    const event = this.getEvent(player, context, additionalProperties);
                    event.cards = availableHand.slice(0, amount);
                    events.push(event);
                    continue;
                }
                context.game.promptForSelect(player, {
                    activePromptTitle: 'Choose ' + (amount === 1 ? 'a card' : amount + ' cards') + ' to discard',
                    context: context,
                    mode: TargetMode.Exactly,
                    numCards: amount,
                    location: Location.Hand,
                    controller: player === context.player ? Players.Self : Players.Opponent,
                    cardCondition: (card: BaseCard) => properties.cardCondition(card, context),
                    onSelect: (player: Player, cards: BaseCard[]) => {
                        const event = this.getEvent(player, context, additionalProperties);
                        event.cards = cards;
                        events.push(event);
                        return true;
                    }
                });
            }
        }
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnCardsDiscardedFromHand, Context>, player: Player, context: Context, additionalProperties: Record<string, unknown>): void {
        const { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.cards = [];
        event.discardedAtRandom = false;
    }

    override eventHandler(event: ActionEvent<EventName.OnCardsDiscardedFromHand, Context>): void {
        const context = event.context;
        context.game.addMessage(msg`${event.player} discards ${event.cards}`);
        event.discardedCards = event.cards;
        for(const card of event.cards ?? []) {
            event.player.moveCard(card, card.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile);
        }
    }
}
