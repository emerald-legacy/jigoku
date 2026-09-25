import type { AbilityContext } from '../AbilityContext.js';
import { EventName, FavorType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

import type { ActionEvent } from './GameAction.js';
export interface ClaimFavorProperties extends PlayerActionProperties {
    target?: Player;
    side?: FavorType;
}

export class ClaimFavorAction<C extends AbilityContext = AbilityContext> extends PlayerAction<ClaimFavorProperties, EventName, C> {
    name = 'claimFavor';
    eventName = EventName.OnClaimFavor;
    effect = 'claim the Emperor\'s favor';

    hasLegalTarget(context: C, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        if(Array.isArray(properties.target)) {
            return !!properties.target[0];
        }
        return !!properties.target;
    }

    canAffect(player: Player, context: C, _additionalProperties = {}): boolean {
        return !!player && super.canAffect(player, context);
    }

    eventHandler(event: ActionEvent<EventName.OnClaimFavor, C>, additionalProperties: Record<string, unknown> = {}): void {
        let { side } = this.getProperties((event.context), additionalProperties);
        if(event.player) {
            event.player.claimImperialFavor(side);
        }
    }
}
