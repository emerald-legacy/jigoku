import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, FavorType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { targetList, type ActionEvent } from './GameAction.js';

export interface ClaimFavorProperties extends PlayerActionProperties {
    side?: FavorType;
}

export class ClaimImperialFavorAction<C extends AbilityContext = AbilityContext> extends PlayerAction<ClaimFavorProperties, EventName.OnClaimFavor, C> {
    name = 'claimImperialFavor';
    eventName = EventName.OnClaimFavor;
    effect = 'claim the Emperor\'s favor';

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        return targetList(this.getProperties(context, additionalProperties).target).length > 0;
    }

    canAffect(player: Player, context: C, _additionalProperties = {}): boolean {
        return super.canAffect(player, context);
    }

    eventHandler(event: ActionEvent<EventName.OnClaimFavor, C>, additionalProperties: ActionOverrides = {}): void {
        const { side } = this.getProperties(event.context, additionalProperties);
        event.player.claimImperialFavor(side);
    }
}
