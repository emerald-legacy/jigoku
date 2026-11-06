import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { MessageArgs } from '../GameChat.js';
import { EventName, type FavorType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { targetList, type ActionEvent } from './GameAction.js';

export interface ClaimFavorProperties extends PlayerActionProperties {
    side?: FavorType;
}

export class ClaimImperialFavorAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<ClaimFavorProperties, EventName.OnClaimFavor, Context> {
    override name = 'claimImperialFavor';
    override eventName = EventName.OnClaimFavor;
    override effect = 'claim the favor';

    protected override effectMessage(context: Context): MessageArgs {
        return ['claim the {1} favor', [context.game.rules.imperialFavorSovereign]];
    }

    override hasLegalTarget(context: Context, additionalProperties: ActionOverrides = {}): boolean {
        return targetList(this.getProperties(context, additionalProperties).target).length > 0;
    }

    override canAffect(player: Player, context: Context, _additionalProperties = {}): boolean {
        return super.canAffect(player, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnClaimFavor, Context>, additionalProperties: ActionOverrides = {}): void {
        const { side } = this.getProperties(event.context, additionalProperties);
        event.player.claimImperialFavor(side);
    }
}
