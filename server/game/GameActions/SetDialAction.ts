import type { MessageArgs } from '../GameChat.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

export interface SetDialProperties extends PlayerActionProperties {
    value: number;
}

export class SetDialAction extends PlayerAction<SetDialProperties, EventName.OnSetHonorDial> {
    defaultProperties: SetDialProperties = { value: 0 };

    name = 'setDial';
    eventName = EventName.OnSetHonorDial;
    constructor(propertyFactory: SetDialProperties | ((context: AbilityContext) => SetDialProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): MessageArgs {
        let properties = this.getProperties(context) as SetDialProperties;
        return ['set {0}\'s dial to {1}', [properties.target, properties.value]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as SetDialProperties;
        return properties.value > 0 && properties.value < 6 && super.canAffect(player, context);
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnSetHonorDial>, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { value } = this.getProperties(context, additionalProperties) as SetDialProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.value = value;
    }

    eventHandler(event: GameEvent<EventName.OnSetHonorDial>): void {
        event.player.setShowBid(event.value);
    }
}
