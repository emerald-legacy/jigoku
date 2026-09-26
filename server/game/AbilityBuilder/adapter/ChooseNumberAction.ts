import type { AbilityContext } from '../../AbilityContext.js';
import type { Event } from '../../Events/Event.js';
import { GameAction } from '../../GameActions/GameAction.js';
import type { MessageArgs } from '../../GameChat.js';
import type Player from '../../Player.js';

export interface ChooseNumberOptions {
    min: number;
    max: number;
    prompt?: string;
}

/** "Choose a number" while the effect resolves. The effect for the chosen number joins the same window. */
export class ChooseNumberAction extends GameAction {
    name = 'builderChooseNumber';

    constructor(
        private readonly player: Player,
        private readonly options: ChooseNumberOptions,
        private readonly effectFor: (amount: number) => undefined | GameAction
    ) {
        super({});
    }

    private numbers(context: AbilityContext): number[] {
        const numbers: number[] = [];
        for(let amount = this.options.min; amount <= this.options.max; amount++) {
            if(this.effectFor(amount)?.hasLegalTarget(context)) {
                numbers.push(amount);
            }
        }
        return numbers;
    }

    setDefaultTarget(): void {}

    hasLegalTarget(context: AbilityContext): boolean {
        return this.numbers(context).length > 0;
    }

    getEffectMessage(): MessageArgs {
        return ['', []];
    }

    addEventsToArray(events: Event[], context: AbilityContext): void {
        const numbers = this.numbers(context);
        if(numbers.length === 1) {
            this.effectFor(numbers[0])?.addEventsToArray(events, context);
            return;
        }
        context.game.promptWithHandlerMenu(this.player, {
            activePromptTitle: this.options.prompt,
            context,
            choices: numbers.map(String),
            handlers: numbers.map((amount) => () => this.effectFor(amount)?.addEventsToArray(events, context))
        });
    }
}
