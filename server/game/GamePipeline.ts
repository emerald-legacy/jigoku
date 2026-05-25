import type Player from './player.js';
import type BaseCard from './basecard.js';
import type Ring from './ring.js';
import type { Step } from './gamesteps/Step.js';

type StepFactory = () => Step;
type StepItem = Step | StepFactory;

const COMPACT_THRESHOLD = 64;

export class GamePipeline {
    public pipeline: Array<StepItem> = [];
    public queue: Array<StepItem> = [];
    private cursor = 0;

    initialise(steps: StepItem[]): void {
        this.pipeline = steps;
        this.cursor = 0;
    }

    get length(): number {
        return this.pipeline.length - this.cursor;
    }

    getCurrentStep(): Step {
        const step = this.pipeline[this.cursor];

        if(typeof step === 'function') {
            const createdStep = step();
            this.pipeline[this.cursor] = createdStep;
            return createdStep;
        }

        return step;
    }

    queueStep(step: Step) {
        if(this.length === 0) {
            this.pipeline.push(step);
        } else {
            var currentStep = this.getCurrentStep();
            if(currentStep.queueStep) {
                currentStep.queueStep(step);
            } else {
                this.queue.push(step);
            }
        }
    }

    cancelStep() {
        if(this.length === 0) {
            return;
        }

        var step = this.getCurrentStep();

        if(step.cancelStep && step.isComplete) {
            step.cancelStep();
            if(!step.isComplete()) {
                return;
            }
        }

        this.#advance();
    }

    handleCardClicked(player: Player, card: BaseCard) {
        if(this.length > 0) {
            var step = this.getCurrentStep();
            if(step.onCardClicked(player, card) !== false) {
                return true;
            }
        }

        return false;
    }

    handleRingClicked(player: Player, ring: Ring) {
        if(this.length === 0) {
            return false;
        }

        const step = this.getCurrentStep();
        if(step.onRingClicked(player, ring) !== false) {
            return true;
        }
        return false;
    }

    handleMenuCommand(player: Player, arg: string, uuid: string, method: string) {
        if(this.length === 0) {
            return false;
        }

        const step = this.getCurrentStep();
        return step.onMenuCommand(player, arg, uuid, method) !== false;
    }

    continue() {
        this.#queueIntoPipeline();

        while(this.length > 0) {
            const currentStep = this.getCurrentStep();

            // Explicitly check for a return of false - if no return values is
            // defined then just continue to the next step.
            if(currentStep.continue() === false) {
                if(this.queue.length === 0) {
                    return false;
                }
            } else {
                this.#advance();
            }

            this.#queueIntoPipeline();
        }
        return true;
    }

    #advance() {
        this.cursor++;
        if(this.cursor >= COMPACT_THRESHOLD && this.cursor >= this.pipeline.length / 2) {
            this.pipeline = this.pipeline.slice(this.cursor);
            this.cursor = 0;
        }
    }

    #queueIntoPipeline() {
        if(this.queue.length === 0) {
            return;
        }
        // Insert queued items at the cursor position (front of active pipeline)
        this.pipeline.splice(this.cursor, 0, ...this.queue);
        this.queue = [];
    }

    getDebugInfo() {
        return {
            pipeline: this.pipeline.slice(this.cursor).map((step) => this.getDebugInfoForStep(step)),
            queue: this.queue.map((step) => this.getDebugInfoForStep(step))
        };
    }

    getDebugInfoForStep(step: StepItem) {
        if(typeof step === 'function') {
            return step.toString();
        }

        let name = step.constructor.name;
        if(step.pipeline) {
            let result = {};
            result[name] = step.pipeline.getDebugInfo();
            return result;
        }

        if(step.getDebugInfo) {
            return step.getDebugInfo();
        }

        return name;
    }
}
