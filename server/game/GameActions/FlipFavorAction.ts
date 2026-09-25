import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface FlipFavorProperties extends PlayerActionProperties {
    target?: Player;
}

export class FlipFavorAction<C extends AbilityContext = AbilityContext> extends PlayerAction<FlipFavorProperties, EventName.OnFlipFavor, C> {
    name = 'claimFavor';
    eventName = EventName.OnFlipFavor;
    effect = 'flip the Imperial favor';

    hasLegalTarget(context: C, _additionalProperties = {}): boolean {
        return this.playerHasFlippableFavor(context.player) || (!!context.player.opponent && this.playerHasFlippableFavor(context.player.opponent));
    }

    playerHasFlippableFavor(player: Player) {
        return !!player && !!player.imperialFavor && player.imperialFavor !== 'both';
    }

    canAffect(player: Player, context: C, _additionalProperties = {}): boolean {
        return !!player && this.playerHasFlippableFavor(player) && super.canAffect(player, context);
    }

    eventHandler(event: ActionEvent<EventName.OnFlipFavor, C>): void {
        const player = event.player;
        if(player.imperialFavor === 'military') {
            player.imperialFavor = 'political';
        } else if(player.imperialFavor === 'political') {
            player.imperialFavor = 'military';
        }
    }
}
