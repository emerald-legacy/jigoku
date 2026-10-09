import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type Player from '../Player.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { resolveChoosingPlayer } from './resolveChoosingPlayer.js';
import { Players, type EventName } from '../Constants.js';
import { GameAction, type GameActionProperties, type GameActionTarget } from './GameAction.js';

export interface ChooseActionProperties<C extends AbilityContext = AbilityContext> extends GameActionProperties {
    activePromptTitle?: string;
    waitingPromptTitle?: string;
    player?: Players.Self | Players.Opponent;
    /** One button per label: its game action, or the action with a chat line. Like `select`'s choices, but chosen while resolving. */
    choices: { [label: string]: GameAction | ChooseActionOption<C> };
}

export interface ChooseActionOption<C extends AbilityContext = AbilityContext> {
    action: GameAction;
    /** The chat line when this option is chosen; `target` is the action's target. */
    message?: (context: C, target: GameActionTarget | GameActionTarget[] | undefined, chooser: Player) => MessageArgs;
}

/** Each choice with its label, a bare game action as an option without a chat line. */
function options<C extends AbilityContext>(choices: ChooseActionProperties<C>['choices']): [string, ChooseActionOption<C>][] {
    return Object.entries(choices).map(([label, choice]) => [label, choice instanceof GameAction ? { action: choice } : choice]);
}

export class ChooseGameAction<C extends AbilityContext = AbilityContext> extends GameAction<ChooseActionProperties<C>, EventName, C, 'activePromptTitle' | 'choices'> {
    effect = 'choose between different actions';
    defaultProperties = {
        activePromptTitle: 'Select an action:',
        choices: {}
    };

    getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        return this.getCompositeProperties(context, additionalProperties, (properties) => options(properties.choices).map(([_, option]) => option.action));
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        return options(this.getProperties(context, additionalProperties).choices).some(([_, { action }]) => action.hasLegalTarget(context));
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const legalChoices = options(properties.choices).filter(([_, option]) =>
            option.action.hasLegalTarget(context)
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
            context.game.queueSimpleStep(() => choice.action.addEventsToArray(events, context));
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

    canAffect(target: GameObject, context: C, additionalProperties: ActionOverrides = {}): boolean {
        return options(this.getProperties(context, additionalProperties).choices).some(([_, { action }]) => action.canAffect(target, context));
    }

    hasTargetsChosenByInitiatingPlayer(context: C) {
        return options(this.getProperties(context).choices).some(([_, { action }]) => action.hasTargetsChosenByInitiatingPlayer(context));
    }
}
