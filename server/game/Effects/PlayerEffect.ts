import Effect, { type EffectMatchFn } from './Effect.js';
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

        const sourceController = this.source.controller;
        if(this.targetController === Players.Self && target === sourceController.opponent) {
            return false;
        } else if(this.targetController === Players.Opponent && target === sourceController) {
            return false;
        }
        return true;
    }

    getTargets(): any[] {
        const matchFn = this.match as EffectMatchFn;
        return this.game.getPlayers().filter((player: any) => matchFn(player));
    }
}
