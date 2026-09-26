import type { AbilityContext } from '../../AbilityContext.js';
import type { Event } from '../../Events/Event.js';
import { GameAction } from '../../GameActions/GameAction.js';
import * as GameActions from '../../GameActions/GameActions.js';
import type { MessageArgs } from '../../GameChat.js';
import type Player from '../../Player.js';

export interface Payment {
    action: GameAction;
    /** For example "Lose 1 honor". */
    label: string;
}

/**
 * "You may pay X to Y". The player decides when this event resolves, so the effects listed
 * before it are already applied. Y resolves only if the payment resolved in full.
 */
export class MayPayAction extends GameAction {
    name = 'builderMayPay';

    constructor(
        private readonly player: Player,
        private readonly payment: Payment,
        private readonly post: undefined | GameAction,
        /** For example "resolve this ability again". Without it, the choice is "for no effect". */
        private readonly postLabel: undefined | string
    ) {
        super({});
    }

    setDefaultTarget(): void {}

    hasLegalTarget(context: AbilityContext): boolean {
        return this.payment.action.hasLegalTarget(context);
    }

    isOptional(): boolean {
        return true;
    }

    getEffectMessage(): MessageArgs {
        return ['', []];
    }

    addEventsToArray(events: Event[], context: AbilityContext): void {
        GameActions.handler({
            // Wait for the other effects of the window, so that the game state shows them.
            handler: () =>
                context.game.queueSimpleStep(() => {
                    context.game.checkGameState(true);
                    this.prompt(context);
                })
        }).addEventsToArray(events, context);
    }

    private prompt(context: AbilityContext): void {
        const choice = this.postLabel
            ? `${this.payment.label} to ${this.postLabel}`
            : `${this.payment.label} for no effect`;
        context.game.promptWithHandlerMenu(this.player, {
            context,
            choices: [choice, 'Done'],
            handlers: [
                () => {
                    context.game.addMessage('{0} chooses to {1}', this.player, choice.toLowerCase());
                    this.pay(context);
                },
                () => context.game.addMessage('{0} chooses not to {1}', this.player, choice.toLowerCase())
            ]
        });
    }

    private pay(context: AbilityContext): void {
        const events = this.payment.action.getEventArray(context);
        context.game.openThenEventWindow(events);
        context.game.queueSimpleStep(() => {
            if(this.post && events.length > 0 && events.every((event) => event.isFullyResolved())) {
                this.post.resolve(undefined, context);
            }
        });
    }
}
