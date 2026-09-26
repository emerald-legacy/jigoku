import { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import Player from '../Player.js';
import { PlayerAction, PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export type DiscardFavorProperties = PlayerActionProperties;

export class DiscardFavorAction<C extends AbilityContext = AbilityContext> extends PlayerAction<DiscardFavorProperties, EventName.OnDiscardFavor, C> {
    name = 'discardFavor';
    eventName = EventName.OnDiscardFavor;
    cost = 'discarding the Imperial Favor';
    effect = 'make {0} lose the Imperial Favor';

    canAffect(player: Player, context: C): boolean {
        return !!player.imperialFavor && super.canAffect(player, context);
    }

    eventHandler(event: ActionEvent<EventName.OnDiscardFavor, C>): void {
        event.player?.loseImperialFavor();
    }
}
