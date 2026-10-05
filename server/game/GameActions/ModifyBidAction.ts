import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { targetList, type ActionEvent } from './GameAction.js';

export enum Direction {
    Decrease = 'decrease',
    Increase = 'increase',
    Prompt = 'prompt'
}

export interface ModifyBidProperties extends PlayerActionProperties {
    amount?: number;
    direction?: Direction;
}

export class ModifyBidAction<C extends AbilityContext = AbilityContext> extends PlayerAction<ModifyBidProperties, EventName.OnModifyBid, C, 'amount' | 'direction'> {
    name = 'modifyBid';
    eventName = EventName.OnModifyBid;
    defaultProperties = {
        amount: 1,
        direction: Direction.Increase
    };

    defaultTargets(context: C) {
        return [context.player];
    }

    protected effectMessage(context: C): MessageArgs {
        const properties = this.getProperties(context);
        if(properties.direction === Direction.Prompt) {
            return ['modify their honor bid by {0}', []];
        }
        return ['{0} their bid by {1}', [properties.amount]];
    }

    /** The direction, or the amount when the player picks the direction. */
    protected effectMessageTarget(context: C): MsgArg {
        const properties = this.getProperties(context);
        return properties.direction === Direction.Prompt ? properties.amount : properties.direction;
    }

    canAffect(player: Player, context: C, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.amount === 0 || (properties.direction === Direction.Decrease && player.honorBid === 0)) {
            return false;
        }
        return super.canAffect(player, context);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: Record<string, unknown> = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.direction !== Direction.Prompt) {
            return super.addEventsToArray(events, context);
        }
        for(const player of targetList(properties.target)) {
            if(player.honorBid === 0) {
                const event = this.getEvent(player, context, additionalProperties);
                event.direction = Direction.Increase;
                context.game.addMessage('{0} chooses to increase their honor bid', player);
                events.push(event);
            } else {
                context.game.promptWithHandlerMenu(player, {
                    context: context,
                    choices: ['Increase honor bid', 'Decrease honor bid'],
                    choiceHandler: (choice: string) => {
                        const event = this.getEvent(player, context, additionalProperties);
                        if(choice === 'Increase honor bid') {
                            context.game.addMessage('{0} chooses to increase their honor bid', player);
                            event.direction = Direction.Increase;
                        } else {
                            context.game.addMessage('{0} chooses to decrease their honor bid', player);
                            event.direction = Direction.Decrease;
                        }
                        events.push(event);
                    }
                });
            }
        }
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnModifyBid, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        const { amount, direction } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.direction = direction;
    }

    eventHandler(event: ActionEvent<EventName.OnModifyBid, C>): void {
        const player = event.player;
        const amount = event.amount;
        if(event.direction === Direction.Increase) {
            player.honorBidModifier += amount;
        } else {
            player.honorBidModifier -= amount;
        }
    }
}
