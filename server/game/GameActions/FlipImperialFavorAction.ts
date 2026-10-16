import type { AbilityContext } from '../AbilityContext.js';
import { EventName, FavorType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export type FlipFavorProperties = PlayerActionProperties;

export class FlipImperialFavorAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<FlipFavorProperties, EventName.OnFlipFavor, Context> {
    override name = 'flipImperialFavor';
    override eventName = EventName.OnFlipFavor;
    override effect = 'flip the Imperial favor';

    override hasLegalTarget(context: Context, _additionalProperties = {}): boolean {
        return this.playerHasFlippableFavor(context.player) || (!!context.player.opponent && this.playerHasFlippableFavor(context.player.opponent));
    }

    playerHasFlippableFavor(player: Player) {
        return !!player.imperialFavor && player.imperialFavor !== FavorType.Both;
    }

    override canAffect(player: Player, context: Context, _additionalProperties = {}): boolean {
        return this.playerHasFlippableFavor(player) && super.canAffect(player, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnFlipFavor, Context>): void {
        const player = event.player;
        if(player.imperialFavor === FavorType.Military) {
            player.imperialFavor = FavorType.Political;
        } else if(player.imperialFavor === FavorType.Political) {
            player.imperialFavor = FavorType.Military;
        }
    }
}
