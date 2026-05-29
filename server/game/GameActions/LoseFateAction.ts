import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

export interface LoseFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class LoseFateAction extends PlayerAction {
    name = 'spendFate';
    eventName = EventNames.OnModifyFate;
    defaultProperties: LoseFateProperties = { amount: 1 };

    constructor(propertyFactory: LoseFateProperties | ((context: AbilityContext) => LoseFateProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: LoseFateProperties = this.getProperties(context);
        return ['make {0} lose {1} fate', [properties.target, properties.amount]];
    }

    getCostMessage(context: AbilityContext): [string, any[]] {
        let properties: LoseFateProperties = this.getProperties(context);
        return ['spending {1} fate', [properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: LoseFateProperties = this.getProperties(context, additionalProperties);
        return (properties.amount ?? 0) > 0 && player.fate > 0 && super.canAffect(player, context, additionalProperties);
    }

    addPropertiesToEvent(event: any, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { amount } = this.getProperties(context, additionalProperties) as LoseFateProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = -(amount ?? 0);
    }

    eventHandler(event: any): void {
        event.player.modifyFate(event.amount);
    }
}
