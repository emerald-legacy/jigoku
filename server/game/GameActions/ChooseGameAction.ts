import type { MsgArg } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { Players, type EventName } from '../Constants.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

export interface ChooseActionProperties extends GameActionProperties {
    activePromptTitle?: string;
    waitingPromptTitle?: string;
    messageArgs?: MsgArg[];
    player?: Players.Self | Players.Opponent;
    options: { [label: string]: { action: GameAction; message?: string } };
}

export class ChooseGameAction<C extends AbilityContext = AbilityContext> extends GameAction<ChooseActionProperties, EventName, C, 'activePromptTitle' | 'options' | 'messageArgs'> {
    effect = 'choose between different actions';
    defaultProperties = {
        activePromptTitle: 'Select an action:',
        options: {},
        messageArgs: []
    };

    getProperties(context: C, additionalProperties = {}) {
        return this.getCompositeProperties(context, additionalProperties, (properties) => Object.values(properties.options).map((option) => option.action));
    }

    hasLegalTarget(context: C, additionalProperties = {}): boolean {
        const { options } = this.getProperties(context, additionalProperties);
        return Object.values(options).some(({ action }) => action.hasLegalTarget(context));
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
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
                context.game.addMessage(choice.message, player, properties.target, ...properties.messageArgs);
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

    canAffect(target: GameObject, context: C, additionalProperties = {}): boolean {
        const { options } = this.getProperties(context, additionalProperties);
        return Object.values(options).some(({ action }) => action.canAffect(target, context));
    }

    hasTargetsChosenByInitiatingPlayer(context: C) {
        const { options } = this.getProperties(context);
        return Object.values(options).some(({ action }) => action.hasTargetsChosenByInitiatingPlayer(context));
    }
}
