import Effect, { type EffectMatchFn, type EffectProperties } from './Effect.js';
import { Players } from '../Constants.js';
import type { EffectName } from '../Constants.js';
import type EffectSource from '../EffectSource.js';
import type { SourceWithState } from '../EffectSource.js';
import type Game from '../Game.js';
import type Player from '../Player.js';
import type { EffectBase } from './EffectBase.js';

export default class PlayerEffect extends Effect<Player> {
    targetController: string | Player;

    constructor(game: Game, source: EffectSource, properties: EffectProperties<Player>, effect: EffectBase<EffectName, Player>) {
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

        const sourceController = (this.source as SourceWithState).controller;
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
