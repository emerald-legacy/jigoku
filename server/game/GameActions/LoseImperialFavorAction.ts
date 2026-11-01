import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export type DiscardFavorProperties = PlayerActionProperties;

export class LoseImperialFavorAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<DiscardFavorProperties, EventName.OnDiscardFavor, Context> {
    override name = 'loseImperialFavor';
    override eventName = EventName.OnDiscardFavor;
    override cost = 'discarding the Imperial Favor';
    override effect = 'make {0} lose the Imperial Favor';

    override defaultTargets(context: Context): Player[] {
        return this.opponentTargets(context);
    }

    override canAffect(player: Player, context: Context): boolean {
        return !!player.imperialFavor && super.canAffect(player, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnDiscardFavor, Context>): void {
        event.player.loseImperialFavor();
    }
}
