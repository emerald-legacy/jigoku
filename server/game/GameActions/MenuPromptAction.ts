import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { Players, type EventName } from '../Constants.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

export interface MenuPromptProperties extends GameActionProperties {
    activePromptTitle: string;
    player?: Players.Self | Players.Opponent;
    gameAction: GameAction;
    choices: string[] | ((properties: MenuPromptProperties) => string[]);
    choiceHandler: (choice: string, displayMessage: boolean, properties: MenuPromptProperties) => object;
}

export class MenuPromptAction<C extends AbilityContext = AbilityContext> extends GameAction<MenuPromptProperties, EventName, C> {
    protected effectMessage(): MessageArgs {
        return ['make a choice for {0}', []];
    }

    getProperties(context: C, additionalProperties = {}) {
        const properties = super.getProperties(context, additionalProperties);
        const choices = properties.choices;
        return Object.assign(properties, { choices: typeof choices === 'function' ? choices(properties) : choices });
    }

    canAffect(target: GameObject, context: C, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.choices.some((choice) => {
            const childProperties = properties.choiceHandler(choice, false, properties);
            return properties.gameAction.canAffect(target, context, childProperties);
        });
    }

    hasLegalTarget(context: C, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.choices.some((choice) => {
            const childProperties = properties.choiceHandler(choice, false, properties);
            return properties.gameAction.hasLegalTarget(context, childProperties);
        });
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: Record<string, unknown> = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const choices = properties.choices;
        if(choices.length === 0 || (properties.player === Players.Opponent && !context.player.opponent)) {
            return;
        }
        const player = properties.player === Players.Opponent ? context.player.opponent : context.player;
        if(!player) {
            return;
        }
        const choiceHandler = (choice: string) => {
            const childProperties = properties.choiceHandler(choice, true, properties);
            properties.gameAction.addEventsToArray(events, context, childProperties);
        };
        if(choices.length === 1) {
            choiceHandler(choices[0]);
            return;
        }
        context.game.promptWithHandlerMenu(player, { ...properties, context, choiceHandler, choices });
    }

    hasTargetsChosenByInitiatingPlayer(context: C) {
        const properties = this.getProperties(context);
        return properties.gameAction.hasTargetsChosenByInitiatingPlayer(context);
    }
}
