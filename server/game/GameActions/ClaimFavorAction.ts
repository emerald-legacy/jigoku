import type { AbilityContext } from '../AbilityContext.js';
import { EventName, FavorType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export interface ClaimFavorProperties extends PlayerActionProperties {
    target?: Player;
    side?: FavorType;
}

export class ClaimFavorAction extends PlayerAction<ClaimFavorProperties> {
    name = 'claimFavor';
    eventName = EventName.OnClaimFavor;
    effect = 'claim the Emperor\'s favor';

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        if(Array.isArray(properties.target)) {
            return !!properties.target[0];
        }
        return !!properties.target;
    }

    canAffect(player: Player, context: AbilityContext, _additionalProperties = {}): boolean {
        return !!player && super.canAffect(player, context);
    }

    eventHandler(event: GameEvent<EventName.OnClaimFavor>, additionalProperties: Record<string, unknown> = {}): void {
        let { side } = this.getProperties((event.context as AbilityContext), additionalProperties);
        if(event.player) {
            event.player.claimImperialFavor(side);
        }
    }
}
