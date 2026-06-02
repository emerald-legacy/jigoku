import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName, Location, Players, TargetMode } from '../Constants.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

export interface ChosenDiscardProperties extends PlayerActionProperties {
    amount?: number;
    targets?: boolean;
    cardCondition?: (card: BaseCard, context: AbilityContext) => boolean;
}

type ResolvedChosenDiscardProperties = ChosenDiscardProperties & {
    amount: NonNullable<ChosenDiscardProperties['amount']>;
    cardCondition: NonNullable<ChosenDiscardProperties['cardCondition']>;
};

export class ChosenDiscardAction extends PlayerAction<ChosenDiscardProperties, EventName.OnCardsDiscardedFromHand> {
    defaultProperties: ChosenDiscardProperties = {
        amount: 1,
        targets: true,
        cardCondition: () => true
    };
    name = 'discard';
    eventName = EventName.OnCardsDiscardedFromHand;

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context);
        return ['make {0} discard {1} cards', [properties.target, properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as ResolvedChosenDiscardProperties;
        const availableHand = player.hand.filter((card) => properties.cardCondition(card, context));

        if(availableHand.length === 0 || properties.amount === 0) {
            return false;
        }
        return super.canAffect(player, context);
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties) as ResolvedChosenDiscardProperties;
        for(let player of properties.target as Player[]) {
            const availableHand = player.hand.filter((card) => properties.cardCondition(card, context));
            let amount = Math.min(availableHand.length, properties.amount);
            if(amount > 0) {
                if(amount >= availableHand.length) {
                    let event = this.getEvent(player, context);
                    event.cards = availableHand;
                    events.push(event);
                    return;
                }

                if(properties.targets && context.choosingPlayerOverride && context.choosingPlayerOverride !== player) {
                    let event = this.getEvent(player, context);
                    event.cards = availableHand.slice(0, amount);
                    events.push(event);
                    return;
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
                        let event = this.getEvent(player, context);
                        event.cards = cards;
                        events.push(event);
                        return true;
                    }
                });
            }
        }
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnCardsDiscardedFromHand>, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown>): void {
        let { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.cards = [];
        event.discardedAtRandom = false;
    }

    eventHandler(event: GameEvent<EventName.OnCardsDiscardedFromHand>): void {
        const context = event.context as AbilityContext;
        context.game.addMessage('{0} discards {1}', event.player, event.cards);
        event.discardedCards = event.cards;
        for(let card of event.cards as BaseCard[]) {
            (event.player as Player).moveCard(card, card.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile);
        }
    }
}
