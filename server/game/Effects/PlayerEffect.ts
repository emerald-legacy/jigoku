import { ActiveEffect, type EffectMatchFn, type EffectProperties } from './ActiveEffect.js';
import { Players } from '../Constants.js';
import type { EffectName } from '../Constants.js';
import type { EffectSource } from '../EffectSource.js';
import type Game from '../Game.js';
import type Player from '../Player.js';
import type { EffectApplier } from './EffectApplier.js';

export class PlayerEffect extends ActiveEffect<Player> {
    targetController: string | Player;

    constructor(game: Game, source: EffectSource, properties: EffectProperties<Player>, effect: EffectApplier<EffectName, Player>) {
        super(game, source, properties, effect);
        this.targetController = properties.targetController || Players.Self;
        if(typeof this.match !== 'function') {
            this.match = () => true;
        }
    }

    isValidTarget(target: Player): boolean {
        if(this.targetController !== Players.Any && this.targetController !== Players.Self && this.targetController !== Players.Opponent && this.targetController !== target) {
            return false;
        }

        const sourceController = this.source.getEffectController();
        if(this.targetController === Players.Self && target === sourceController?.opponent) {
            return false;
        } else if(this.targetController === Players.Opponent && target === sourceController) {
            return false;
        }
        return true;
    }

    getTargets(matchFn: EffectMatchFn<Player>): Player[] {
        return this.game.getPlayers().filter((player: Player) => matchFn(player));
    }
}
