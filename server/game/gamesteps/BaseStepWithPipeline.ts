import { GamePipeline } from '../GamePipeline.js';
import { BaseStep } from './BaseStep.js';
import type { Step } from './Step.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';

export class BaseStepWithPipeline extends BaseStep implements Step {
    pipeline = new GamePipeline();

    queueStep(step: Step) {
        this.pipeline.queueStep(step);
    }

    isComplete() {
        return this.pipeline.length === 0;
    }

    onCardClicked(player: Player, card: BaseCard): boolean {
        return this.pipeline.handleCardClicked(player, card);
    }

    onRingClicked(player: Player, ring: Ring) {
        return this.pipeline.handleRingClicked(player, ring);
    }

    onMenuCommand(player: Player, arg: string, uuid: string, method: string) {
        return this.pipeline.handleMenuCommand(player, arg, uuid, method);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    continue() {
        try {
            return this.pipeline.continue();
        } catch(e) {
            this.game.reportError(e as Error);
            return true;
        }
    }
}
