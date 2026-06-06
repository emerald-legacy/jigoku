import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { Players } from '../Constants.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

export interface MenuPromptProperties extends GameActionProperties {
    activePromptTitle: string;
    player?: Players.Self | Players.Opponent;
    gameAction: GameAction;
    choices: string[] | ((properties: MenuPromptProperties) => string[]);
    choiceHandler: (choice: string, displayMessage: boolean, properties: MenuPromptProperties) => object;
}

export class MenuPromptAction extends GameAction {
    constructor(properties: MenuPromptProperties | ((context: AbilityContext) => MenuPromptProperties)) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): MessageArgs {
        let { target } = this.getProperties(context);
        return ['make a choice for {0}', [target]];
    }

    getProperties(context: AbilityContext, additionalProperties = {}): MenuPromptProperties {
        let properties = super.getProperties(context, additionalProperties) as MenuPromptProperties;
        if(typeof properties.choices === 'function') {
            properties.choices = properties.choices(properties);
        }
        return properties;
    }

    canAffect(target: GameObject, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return (properties.choices as string[]).some((choice) => {
            let childProperties = properties.choiceHandler(choice, false, properties);
            return properties.gameAction.canAffect(target, context, childProperties);
        });
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return (properties.choices as string[]).some((choice) => {
            let childProperties = properties.choiceHandler(choice, false, properties);
            return properties.gameAction.hasLegalTarget(context, childProperties);
        });
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        const choices = properties.choices as string[];
        if(choices.length === 0 || (properties.player === Players.Opponent && !context.player.opponent)) {
            return;
        }
        let player = properties.player === Players.Opponent ? context.player.opponent : context.player;
        if(!player) {
            return;
        }
        let choiceHandler = (choice: string) => {
            let childProperties = properties.choiceHandler(choice, true, properties);
            properties.gameAction.addEventsToArray(events, context, childProperties);
        };
        if(choices.length === 1) {
            choiceHandler(choices[0]);
            return;
        }
        context.game.promptWithHandlerMenu(player, Object.assign({}, properties, { context, choiceHandler }));
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext) {
        let properties = this.getProperties(context);
        return properties.gameAction.hasTargetsChosenByInitiatingPlayer(context);
    }
}
