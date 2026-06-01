import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { Players } from '../Constants.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

export interface ChooseActionProperties extends GameActionProperties {
    activePromptTitle?: string;
    messageArgs?: unknown[];
    player?: Players.Self | Players.Opponent;
    options: { [label: string]: { action: GameAction; message?: string } };
}

export class ChooseGameAction extends GameAction {
    effect = 'choose between different actions';
    defaultProperties: ChooseActionProperties = {
        activePromptTitle: 'Select an action:',
        options: {},
        messageArgs: []
    };
    constructor(properties: ChooseActionProperties | ((context: AbilityContext) => ChooseActionProperties)) {
        super(properties);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): ChooseActionProperties {
        const properties = super.getProperties(context, additionalProperties) as ChooseActionProperties;
        for(const opt of Object.values(properties.options)) {
            opt.action.setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        const { options } = this.getProperties(context, additionalProperties);
        return Object.values(options).some(({ action }) => action.hasLegalTarget(context));
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const legalChoices = Object.entries(properties.options).filter(([_, option]) =>
            option.action.hasLegalTarget(context)
        );
        if(legalChoices.length === 0) {
            return;
        }

        const { activePromptTitle, target } = properties;
        const opponent = context.player.opponent;
        const player = properties.player === Players.Opponent && opponent ? opponent : context.player;
        const choiceLabels = legalChoices.map(([label, _]) => label);
        const choiceHandler = (choiceLabel: string): void => {
            const choice = legalChoices.find(([label, _]) => label === choiceLabel)?.[1];
            if(!choice) {
                return;
            }
            if(choice.message) {
                context.game.addMessage(choice.message, player, properties.target, ...(properties.messageArgs ?? []));
            }
            context.game.queueSimpleStep(() => choice.action.addEventsToArray(events, context));
        };
        context.game.promptWithHandlerMenu(player, {
            activePromptTitle,
            context,
            choices: choiceLabels,
            choiceHandler,
            target
        });
    }

    canAffect(target: GameObject, context: AbilityContext, additionalProperties = {}): boolean {
        const { options } = this.getProperties(context, additionalProperties);
        return Object.values(options).some(({ action }) => action.canAffect(target, context));
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext) {
        const { options } = this.getProperties(context);
        return Object.values(options).some(({ action }) => action.hasTargetsChosenByInitiatingPlayer(context));
    }
}
