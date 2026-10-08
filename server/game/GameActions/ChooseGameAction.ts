import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type Player from '../Player.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { Players, type EventName } from '../Constants.js';
import { GameAction, type GameActionProperties, type GameActionTarget } from './GameAction.js';

export interface ChooseActionProperties<C extends AbilityContext = AbilityContext> extends GameActionProperties {
    activePromptTitle?: string;
    waitingPromptTitle?: string;
    player?: Players.Self | Players.Opponent;
    options: { [label: string]: ChooseActionOption<C> };
}

export interface ChooseActionOption<C extends AbilityContext = AbilityContext> {
    action: GameAction;
    /** The chat line when this option is chosen; `target` is the action's target. */
    message?: (context: C, target: GameActionTarget | GameActionTarget[] | undefined, chooser: Player) => MessageArgs;
}

export class ChooseGameAction<C extends AbilityContext = AbilityContext> extends GameAction<ChooseActionProperties<C>, EventName, C, 'activePromptTitle' | 'options'> {
    effect = 'choose between different actions';
    defaultProperties = {
        activePromptTitle: 'Select an action:',
        options: {}
    };

    getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        return this.getCompositeProperties(context, additionalProperties, (properties) => Object.values(properties.options).map((option) => option.action));
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { options } = this.getProperties(context, additionalProperties);
        return Object.values(options).some(({ action }) => action.hasLegalTarget(context));
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const legalChoices = Object.entries(properties.options).filter(([_, option]) =>
            option.action.hasLegalTarget(context)
        );
        if(legalChoices.length === 0) {
            return;
        }

        const { activePromptTitle, waitingPromptTitle, target } = properties;
        const opponent = context.player.opponent;
        const player = properties.player === Players.Opponent && opponent ? opponent : context.player;
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
        const { options } = this.getProperties(context, additionalProperties);
        return Object.values(options).some(({ action }) => action.canAffect(target, context));
    }

    hasTargetsChosenByInitiatingPlayer(context: C) {
        const { options } = this.getProperties(context);
        return Object.values(options).some(({ action }) => action.hasTargetsChosenByInitiatingPlayer(context));
    }
}
