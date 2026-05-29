import type BaseCard from '../basecard.js';
import type Game from '../Game.js';
import type Player from '../player.js';
import type Ring from '../ring.js';
import type { Step } from './Step.js';

export class BaseStep implements Step {
    constructor(public game: Game) {}

    public continue(): undefined | boolean {
        return undefined;
    }

    public onCardClicked(_player: Player, _card: BaseCard): boolean {
        return false;
    }

    public onRingClicked(_player: Player, _ring: Ring): boolean {
        return false;
    }

    public onMenuCommand(_player: Player, _arg: string, _uuid: string, _method: string): boolean {
        return false;
    }

    public getDebugInfo(): string {
        return this.constructor.name;
    }
}
