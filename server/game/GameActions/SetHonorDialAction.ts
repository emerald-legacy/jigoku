import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface SetDialProperties extends PlayerActionProperties {
    value: number;
}

export class SetHonorDialAction<C extends AbilityContext = AbilityContext> extends PlayerAction<SetDialProperties, EventName.OnSetHonorDial, C, 'value'> {
    defaultProperties = { value: 0 };

    name = 'setDial';
    eventName = EventName.OnSetHonorDial;
    protected effectMessage(context: C): MessageArgs {
        return ['set {0}\'s dial to {1}', [this.getProperties(context).value]];
    }

    canAffect(player: Player, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.value > 0 && properties.value < 6 && super.canAffect(player, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnSetHonorDial, C>, player: Player, context: C, additionalProperties: ActionOverrides = {}): void {
        const { value } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.value = value;
    }

    eventHandler(event: ActionEvent<EventName.OnSetHonorDial, C>): void {
        event.player.setShowBid(event.value);
    }
}
