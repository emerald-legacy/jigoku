import type { GamePipeline } from '../GamePipeline.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';

export interface Step {
    continue(): undefined | boolean;
    onCardClicked(player: Player, card: BaseCard): boolean;
    onRingClicked(player: Player, ring: Ring): boolean;
    onMenuCommand(player: Player, arg: string, uuid: string, method: string): boolean;
    getDebugInfo(): string;
    pipeline?: GamePipeline;
    queueStep?(step: Step): void;
    cancelStep?(): void;
    isComplete?(): boolean;
}
