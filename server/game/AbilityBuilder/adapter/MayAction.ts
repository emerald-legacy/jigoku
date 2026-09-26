import type { AbilityContext } from '../../AbilityContext.js';
import type { Event } from '../../Events/Event.js';
import { GameAction } from '../../GameActions/GameAction.js';
import * as GameActions from '../../GameActions/GameActions.js';
import type { MessageArgs } from '../../GameChat.js';
import type Player from '../../Player.js';

export interface MayOptions {
    /** The title of the Yes/No prompt. */
    prompt: string;
    /** The text after "{player} chooses to" in the chat. */
    description: string;
}

/** "X may do Y". The player decides when this effect resolves. */
export class MayAction extends GameAction {
    name = 'builderMay';

    constructor(
        private readonly player: Player,
        private readonly effectAction: GameAction,
        private readonly options: MayOptions
    ) {
        super({});
    }

    setDefaultTarget(): void {}

    hasLegalTarget(context: AbilityContext): boolean {
        return this.effectAction.hasLegalTarget(context);
    }

    isOptional(): boolean {
        return true;
    }

    getEffectMessage(): MessageArgs {
        return ['', []];
    }

    addEventsToArray(events: Event[], context: AbilityContext): void {
        GameActions.handler({ handler: () => this.prompt(context) }).addEventsToArray(events, context);
    }

    private prompt(context: AbilityContext): void {
        const { prompt, description } = this.options;
        context.game.promptWithHandlerMenu(this.player, {
            activePromptTitle: prompt,
            context,
            choices: ['Yes', 'No'],
            handlers: [
                () => {
                    context.game.addMessage('{0} chooses to {1}', this.player, description);
                    this.effectAction.resolve(undefined, context);
                },
                () => context.game.addMessage('{0} chooses not to {1}', this.player, description)
            ]
        });
    }
}
