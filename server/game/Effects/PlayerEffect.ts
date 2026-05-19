import Effect from './Effect.js';
import { Players } from '../Constants.js';
import type Game from '../game.js';

export default class PlayerEffect extends Effect {
    targetController: string;

    constructor(game: Game, source: any, properties: any, effect: any) {
        super(game, source, properties, effect);
        this.targetController = properties.targetController || Players.Self;
        if(typeof this.match !== 'function') {
            this.match = (_player: any) => true;
        }
    }

    isValidTarget(target: any): boolean {
        if(this.targetController !== Players.Any && this.targetController !== Players.Self && this.targetController !== Players.Opponent && this.targetController !== target) {
            return false;
        }

        if(this.targetController === Players.Self && target === this.source.controller.opponent) {
            return false;
        } else if(this.targetController === Players.Opponent && target === this.source.controller) {
            return false;
        }
        return true;
    }

    getTargets(): any[] {
        return this.game.getPlayers().filter((player: any) => this.match(player));
    }
}
