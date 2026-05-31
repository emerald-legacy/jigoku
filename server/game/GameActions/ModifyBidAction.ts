import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

export enum Direction {
    Decrease = 'decrease',
    Increase = 'increase',
    Prompt = 'prompt'
}

export interface ModifyBidProperties extends PlayerActionProperties {
    amount?: number;
    direction?: Direction;
}

export class ModifyBidAction extends PlayerAction {
    name = 'modifyBid';
    eventName = EventNames.OnModifyBid;
    defaultProperties: ModifyBidProperties = {
        amount: 1,
        direction: Direction.Increase
    };

    constructor(propertyFactory: ModifyBidProperties | ((context: AbilityContext) => ModifyBidProperties)) {
        super(propertyFactory);
    }

    defaultTargets(context: AbilityContext) {
        return [context.player];
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let properties: ModifyBidProperties = this.getProperties(context);
        if(properties.direction === Direction.Prompt) {
            return ['modify their honor bid by {0}', [properties.amount]];
        }
        return ['{0} their bid by {1}', [properties.direction, properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: ModifyBidProperties = this.getProperties(context, additionalProperties);
        if(properties.amount === 0 || (properties.direction === Direction.Decrease && player.honorBid === 0)) {
            return false;
        }
        return super.canAffect(player, context);
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let properties: ModifyBidProperties = this.getProperties(context, additionalProperties);
        if(properties.direction !== Direction.Prompt) {
            return super.addEventsToArray(events, context);
        }
        for(const player of properties.target as Player[]) {
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

    addPropertiesToEvent(event: Event, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { amount, direction } = this.getProperties(context, additionalProperties) as ModifyBidProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.direction = direction;
    }

    eventHandler(event: Event): void {
        if(event.direction === Direction.Increase) {
            event.player.honorBidModifier += event.amount;
        } else {
            event.player.honorBidModifier -= event.amount;
        }
    }
}
