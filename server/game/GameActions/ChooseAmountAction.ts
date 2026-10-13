import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { EventName } from '../Constants.js';
import type { GameObject } from '../GameObject.js';
import type Player from '../Player.js';
import { resolveChoosingPlayer, type Chooser } from './resolveChoosingPlayer.js';
import { GameAction, type ActionOverrides, type GameActionProperties, type GameActionTarget } from './GameAction.js';

type Target = GameActionTarget | GameActionTarget[] | undefined;

export interface ChooseAmountProperties<C extends AbilityContext = AbilityContext> extends GameActionProperties {
    activePromptTitle: string;
    player?: Chooser;
    min?: number;
    /** A function of this action's target, e.g. the card a `cardMenu` chose. */
    max: number | ((target: Target) => number);
    gameAction: (amount: number, target: Target) => GameAction;
    message?: (context: C, amount: number, chooser: Player, target: Target) => MessageArgs;
}

/** A number from `min` (default 1) to `max` is chosen while the ability resolves, without a prompt when only one is possible; then `gameAction(amount)` resolves. */
export class ChooseAmountAction<C extends AbilityContext = AbilityContext> extends GameAction<ChooseAmountProperties<C>, EventName, C, 'min'> {
    defaultProperties = { min: 1 };

    protected effectMessage(): MessageArgs {
        return ['make a choice for {0}', []];
    }

    #actions(context: C, additionalProperties: ActionOverrides) {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        const { min, max, gameAction, target } = properties;
        const highest = typeof max === 'function' ? max(target) : max;
        const actions = Array.from({ length: Math.max(highest - min + 1, 0) }, (_, i): [number, GameAction] => [min + i, gameAction(min + i, target)]);
        return { properties, overrides, actions };
    }

    canAffect(target: GameObject, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { overrides, actions } = this.#actions(context, additionalProperties);
        return actions.some(([, action]) => action.canAffect(target, context, overrides));
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { overrides, actions } = this.#actions(context, additionalProperties);
        return actions.some(([, action]) => action.hasLegalTarget(context, overrides));
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const { properties, overrides, actions } = this.#actions(context, additionalProperties);
        const legal = actions.filter(([, action]) => action.hasLegalTarget(context, overrides));
        const player = resolveChoosingPlayer(context, properties.player);
        if(legal.length === 0 || !player) {
            return;
        }
        const choose = (amount: string) => {
            const chosen = legal.find(([n]) => n.toString() === amount);
            if(!chosen) {
                return;
            }
            if(properties.message) {
                context.game.addMessage(properties.message(context, chosen[0], player, properties.target));
            }
            chosen[1].addEventsToArray(events, context, overrides);
        };
        if(legal.length === 1) {
            choose(legal[0][0].toString());
            return;
        }
        context.game.promptWithHandlerMenu(player, {
            context,
            activePromptTitle: properties.activePromptTitle,
            target: properties.target,
            choices: legal.map(([n]) => n.toString()),
            choiceHandler: choose
        });
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { overrides, actions } = this.#actions(context, additionalProperties);
        return actions.some(([, action]) => action.hasTargetsChosenByInitiatingPlayer(context, overrides));
    }
}
