import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface LoseFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class LoseFateAction<C extends AbilityContext = AbilityContext> extends PlayerAction<LoseFateProperties, EventName, C> {
    name = 'spendFate';
    eventName = EventName.OnModifyFate;
    defaultProperties: LoseFateProperties = { amount: 1 };

    constructor(propertyFactory: LoseFateProperties | ((context: C) => LoseFateProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: C): MessageArgs {
        let properties: LoseFateProperties = this.getProperties(context);
        return ['make {0} lose {1} fate', [properties.target, properties.amount]];
    }

    getCostMessage(context: C): MessageArgs {
        let properties: LoseFateProperties = this.getProperties(context);
        return ['spending {1} fate', [properties.amount]];
    }

    canAffect(player: Player, context: C, additionalProperties = {}): boolean {
        let properties: LoseFateProperties = this.getProperties(context, additionalProperties);
        return (properties.amount ?? 0) > 0 && player.fate > 0 && super.canAffect(player, context, additionalProperties);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnModifyFate, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = -(amount ?? 0);
    }

    eventHandler(event: ActionEvent<EventName.OnModifyFate, C>): void {
        (event.player as Player).modifyFate(event.amount as number);
    }
}
