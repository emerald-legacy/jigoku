import Effect, { type EffectMatchFn, type EffectProperties } from './Effect.js';
import { Players } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import type Game from '../Game.js';
import type { GameObject } from '../GameObject.js';
import type Player from '../Player.js';
import type StaticEffect from './StaticEffect.js';

export default class PlayerEffect extends Effect {
    targetController: string;

    constructor(game: Game, source: BaseCard, properties: EffectProperties, effect: StaticEffect) {
        super(game, source, properties, effect);
        this.targetController = properties.targetController || Players.Self;
        if(typeof this.match !== 'function') {
            this.match = () => true;
        }
    }

    isValidTarget(target: GameObject): boolean {
        if(this.targetController !== Players.Any && this.targetController !== Players.Self && this.targetController !== Players.Opponent && (this.targetController as unknown) !== target) {
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

    getTargets(): GameObject[] {
        const matchFn = this.match as EffectMatchFn;
        return this.game.getPlayers().filter((player: Player) => matchFn(player));
    }
}
