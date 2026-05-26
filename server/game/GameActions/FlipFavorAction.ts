import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type Player from '../player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

export interface FlipFavorProperties extends PlayerActionProperties {
    target?: Player;
}

export class FlipFavorAction extends PlayerAction<FlipFavorProperties> {
    name = 'claimFavor';
    eventName = EventNames.OnFlipFavor;
    effect = 'flip the Imperial favor';

    hasLegalTarget(context: AbilityContext, _additionalProperties = {}): boolean {
        return this.playerHasFlippableFavor(context.player) || (!!context.player.opponent && this.playerHasFlippableFavor(context.player.opponent));
    }

    playerHasFlippableFavor(player: Player) {
        return !!player && !!player.imperialFavor && player.imperialFavor !== 'both';
    }

    canAffect(player: Player, context: AbilityContext, _additionalProperties = {}): boolean {
        return !!player && this.playerHasFlippableFavor(player) && super.canAffect(player, context);
    }

    eventHandler(event: any): void {
        if(event.player.imperialFavor === 'military') {
            event.player.imperialFavor = 'political';
        } else if(event.player.imperialFavor === 'political') {
            event.player.imperialFavor = 'military';
        }
    }
}
