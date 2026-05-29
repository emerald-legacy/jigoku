import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

export interface SetDialProperties extends PlayerActionProperties {
    value: number;
}

export class SetDialAction extends PlayerAction {
    defaultProperties: SetDialProperties = { value: 0 };

    name = 'setDial';
    eventName = EventNames.OnSetHonorDial;
    constructor(propertyFactory: SetDialProperties | ((context: AbilityContext) => SetDialProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as SetDialProperties;
        return ['set {0}\'s dial to {1}', [properties.target, properties.value]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as SetDialProperties;
        return properties.value > 0 && properties.value < 6 && super.canAffect(player, context);
    }

    addPropertiesToEvent(event: any, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { value } = this.getProperties(context, additionalProperties) as SetDialProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.value = value;
    }

    eventHandler(event: any): void {
        event.player.setShowBid(event.value);
    }
}
