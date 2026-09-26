import type { GamePipeline } from '../GamePipeline.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';

/** A prompt button's `arg` as the client echoes it back; a button without one sends null. */
export type MenuArg = string | number | null | undefined;

export interface Step {
    continue(): undefined | boolean;
    onCardClicked(player: Player, card: BaseCard): boolean;
    onRingClicked(player: Player, ring: Ring): boolean;
    onMenuCommand(player: Player, arg: MenuArg, uuid: string, method?: string | null): boolean;
    getDebugInfo(): string;
    pipeline?: GamePipeline;
    queueStep?(step: Step): void;
    cancelStep?(): void;
    isComplete?(): boolean;
}
