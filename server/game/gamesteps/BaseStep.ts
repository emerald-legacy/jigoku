import type BaseCard from '../basecard';
import type Game from '../game';
import type Player from '../player';
import type Ring from '../ring';
import type { Step } from './Step';

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
