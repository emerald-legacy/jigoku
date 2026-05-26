import { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import Player from '../player.js';
import { PlayerAction, PlayerActionProperties } from './PlayerAction.js';

export type DiscardFavorProperties = PlayerActionProperties;

export class DiscardFavorAction extends PlayerAction<DiscardFavorProperties> {
    name = 'discardFavor';
    eventName = EventNames.OnDiscardFavor;
    cost = 'discarding the Imperial Favor';
    effect = 'make {0} lose the Imperial Favor';

    canAffect(player: Player, context: AbilityContext): boolean {
        return !!player.imperialFavor && super.canAffect(player, context);
    }

    eventHandler(event: any): void {
        event.player.loseImperialFavor();
    }
}
