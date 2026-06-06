import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, Location, Players, TargetMode } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import type { Event } from '../Events/Event.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { shuffle } from '../utils/shuffle.js';

export interface ChosenReturnToDeckProperties extends PlayerActionProperties {
    amount?: number;
    targets?: boolean;
    shuffle?: boolean;
    bottom?: boolean;
}

export class ChosenReturnToDeckAction extends PlayerAction<ChosenReturnToDeckProperties, EventName.OnCardMoved> {
    defaultProperties: ChosenReturnToDeckProperties = {
        amount: 1,
        targets: true,
        shuffle: false,
        bottom: false
    };
    name = 'returnToDeck';
    eventName = EventName.OnCardMoved;

    getEffectMessage(context: AbilityContext): MessageArgs {
        let properties = this.getProperties(context);
        return ['make {0} return {1} cards to their deck', [properties.target, properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        if(player.hand.length === 0 || properties.amount === 0) {
            return false;
        }
        return super.canAffect(player, context);
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        for(let player of properties.target as Player[]) {
            let amount = Math.min(player.hand.length, properties.amount ?? 0);
            if(amount > 0) {
                if(amount === player.hand.length) {
                    let event = this.getEvent(player, context);
                    event.cards = player.hand.slice(0, amount);
                    events.push(event);
                    return;
                }

                if(properties.targets && context.choosingPlayerOverride && context.choosingPlayerOverride !== player) {
                    let event = this.getEvent(player, context);
                    event.cards = shuffle(player.hand).slice(0, amount);
                    events.push(event);
                    return;
                }
                context.game.promptForSelect(player, {
                    activePromptTitle:
                        'Choose ' + (amount === 1 ? 'a card' : amount + ' cards') + ' to return to your deck',
                    context: context,
                    mode: TargetMode.Exactly,
                    numCards: amount,
                    location: Location.Hand,
                    controller: player === context.player ? Players.Self : Players.Opponent,
                    onSelect: (selectingPlayer: Player, cards: BaseCard | BaseCard[]) => {
                        let event = this.getEvent(selectingPlayer, context);
                        event.cards = Array.isArray(cards) ? cards : [cards];
                        events.push(event);
                        return true;
                    }
                });
            }
        }
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnCardMoved>, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { amount, shuffle, bottom } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.options = { bottom };
        event.amount = amount;
        event.cards = [];
        event.shuffle = shuffle;
        event.bottom = bottom;
    }

    eventHandler(event: GameEvent<EventName.OnCardMoved>): void {
        const cards = event.cards as BaseCard[];
        const context = event.context as AbilityContext;
        context.game.addMessage(
            '{0} returns {1} card{2} to{3} their deck',
            event.player,
            cards.length,
            cards.length === 1 ? '' : 's',
            event.bottom ? ' the bottom of' : ''
        );
        event.discardedCards = cards;
        const players: Player[] = [];
        for(let card of cards) {
            card.owner.moveCard(card, Location.ConflictDeck, event.options);
            if(!players.includes(card.owner)) {
                players.push(card.owner);
            }
        }
        if(event.shuffle) {
            players.forEach((p: Player) => p.shuffleConflictDeck());
        }
    }
}
