import type { ActionOverrides } from './GameAction.js';
import { msg, type MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, Location, Players, TargetMode, RestrictionType } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import type { Event } from '../Events/Event.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties, type PlayerEvent } from './PlayerAction.js';
import { shuffle } from '../utils/random.js';
import { targetList, type ActionEvent } from './GameAction.js';

export interface ChosenReturnToDeckProperties extends PlayerActionProperties {
    amount?: number;
    targets?: boolean;
    shuffle?: boolean;
    bottom?: boolean;
}

export class ChosenReturnToDeckAction<C extends AbilityContext = AbilityContext> extends PlayerAction<ChosenReturnToDeckProperties, EventName.OnCardMoved, C, 'amount' | 'targets' | 'shuffle' | 'bottom'> {
    defaultProperties = {
        amount: 1,
        targets: true,
        shuffle: false,
        bottom: false
    };
    name = 'chosenReturnToDeck';
    restriction = RestrictionType.ReturnToDeck;
    eventName = EventName.OnCardMoved;

    protected effectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        return ['make {0} return {1} cards to their deck', [this.getProperties(context, additionalProperties).amount]];
    }

    canAffect(player: Player, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        if(player.hand.length === 0 || properties.amount === 0) {
            return false;
        }
        return super.canAffect(player, context);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        for(const player of targetList(properties.target)) {
            const amount = Math.min(player.hand.length, properties.amount);
            if(amount > 0) {
                if(amount === player.hand.length) {
                    const event = this.getEvent(player, context, additionalProperties);
                    event.cards = player.hand.slice(0, amount);
                    events.push(event);
                    return;
                }

                if(properties.targets && context.choosingPlayerOverride && context.choosingPlayerOverride !== player) {
                    const event = this.getEvent(player, context, additionalProperties);
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
                        const event = this.getEvent(selectingPlayer, context, additionalProperties);
                        event.cards = Array.isArray(cards) ? cards : [cards];
                        events.push(event);
                        return true;
                    }
                });
            }
        }
    }

    addPropertiesToEvent(event: PlayerEvent<EventName.OnCardMoved, C>, player: Player, context: C, additionalProperties: ActionOverrides = {}): void {
        const { amount, shuffle, bottom } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.options = { bottom };
        event.amount = amount;
        event.cards = [];
        event.shuffle = shuffle;
        event.bottom = bottom;
    }

    eventHandler(event: ActionEvent<EventName.OnCardMoved, C>): void {
        const cards = event.cards ?? [];
        const context = event.context;
        context.game.addMessage(msg`${event.player} returns ${cards.length} card${cards.length === 1 ? '' : 's'} to${event.bottom ? ' the bottom of' : ''} their deck`);
        event.discardedCards = cards;
        const players: Player[] = [];
        for(const card of cards) {
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
