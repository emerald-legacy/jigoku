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

export class SetHonorDialAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<SetDialProperties, EventName.OnSetHonorDial, Context, 'value'> {
    override defaultProperties = { value: 0 };

    override name = 'setHonorDial';
    override eventName = EventName.OnSetHonorDial;
    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        return ['set {0}\'s dial to {1}', [this.getProperties(context, additionalProperties).value]];
    }

    override canAffect(player: Player, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.value > 0 && properties.value < 6 && super.canAffect(player, context);
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnSetHonorDial, Context>, player: Player, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { value } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.value = value;
    }

    override eventHandler(event: ActionEvent<EventName.OnSetHonorDial, Context>): void {
        event.player.setShowBid(event.value);
    }
}
