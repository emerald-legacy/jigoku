import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type Player from '../Player.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import { resolveChoosingPlayer, type Chooser } from './resolveChoosingPlayer.js';
import { GameAction, type GameActionProperties, type GameActionTarget } from './GameAction.js';

export interface ChooseActionProperties<Context extends AbilityContext = AbilityContext> extends GameActionProperties {
    activePromptTitle?: string;
    waitingPromptTitle?: string;
    player?: Chooser;
    /** One button per label: its game action, or the action with a chat line. Like `select`'s choices, but chosen while resolving. */
    choices: { [label: string]: GameAction | ChooseActionOption<Context> };
}

export interface ChooseActionOption<Context extends AbilityContext = AbilityContext> {
    action: GameAction;
    /** The chat line when this option is chosen; `target` is the action's target. */
    message?: (context: Context, target: GameActionTarget | GameActionTarget[] | undefined, chooser: Player) => MessageArgs;
}

/** Each choice with its label, a bare game action as an option without a chat line. */
function options<Context extends AbilityContext>(choices: ChooseActionProperties<Context>['choices']): [string, ChooseActionOption<Context>][] {
    return Object.entries(choices).map(([label, choice]) => [label, choice instanceof GameAction ? { action: choice } : choice]);
}

export class ChooseGameAction<Context extends AbilityContext = AbilityContext> extends CompositeGameAction<ChooseActionProperties<Context>, Context, 'activePromptTitle' | 'choices'> {
    override effect = 'choose between different actions';
    override defaultProperties = {
        activePromptTitle: 'Select an action:',
        choices: {}
    };

    protected children(properties: ChooseActionProperties<Context>) {
        return options(properties.choices).map(([_, option]) => option.action);
    }

    override addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        const legalChoices = options(properties.choices).filter(([_, option]) =>
            option.action.hasLegalTarget(context, overrides)
        );
        if(legalChoices.length === 0) {
            return;
        }

        const { activePromptTitle, waitingPromptTitle, target } = properties;
        const player = resolveChoosingPlayer(context, properties.player);
        if(!player) {
            return;
        }
        const choiceLabels = legalChoices.map(([label, _]) => label);
        const choiceHandler = (choiceLabel: string): void => {
            const choice = legalChoices.find(([label, _]) => label === choiceLabel)?.[1];
            if(!choice) {
                return;
            }
            if(choice.message) {
                context.game.addMessage(choice.message(context, properties.target, player));
            }
            context.game.queueSimpleStep(() => choice.action.addEventsToArray(events, context, overrides));
        };
        context.game.promptWithHandlerMenu(player, {
            activePromptTitle,
            waitingPromptTitle,
            context,
            choices: choiceLabels,
            choiceHandler,
            target
        });
    }
}
