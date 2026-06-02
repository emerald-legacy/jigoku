import type { GameEvent } from '../Events/EventPayloads.js';
import { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import Player from '../Player.js';
import { PlayerAction, PlayerActionProperties } from './PlayerAction.js';

export type DiscardFavorProperties = PlayerActionProperties;

export class DiscardFavorAction extends PlayerAction<DiscardFavorProperties> {
    name = 'discardFavor';
    eventName = EventName.OnDiscardFavor;
    cost = 'discarding the Imperial Favor';
    effect = 'make {0} lose the Imperial Favor';

    canAffect(player: Player, context: AbilityContext): boolean {
        return !!player.imperialFavor && super.canAffect(player, context);
    }

    eventHandler(event: GameEvent<EventName.OnDiscardFavor>): void {
        event.player?.loseImperialFavor();
    }
}
