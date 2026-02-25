import { AbilityContext } from './AbilityContext.js';
import BaseAbility from './baseability.js';
import { Stages } from './Constants.js';
import type Game from './game';
import type BaseCard from './basecard';
import type Player from './player';

interface ThenAbilityProperties {
    cost?: any;
    target?: any;
    gameAction?: any;
    handler?: (context: AbilityContext) => void;
    then?: ThenAbilityProperties | ((context: AbilityContext) => ThenAbilityProperties);
    thenCondition?: (context: AbilityContext) => boolean;
    message?: string | ((context: AbilityContext) => string);
    messageArgs?: any[] | ((context: AbilityContext) => any[]);
    [key: string]: any;
}

class ThenAbility extends BaseAbility {
    game: Game;
    card: BaseCard;
    properties: ThenAbilityProperties;
    handler: (context: AbilityContext) => void;
    cannotTargetFirst = true;

    constructor(game: Game, card: BaseCard, properties: ThenAbilityProperties) {
        super(properties);

        this.game = game;
        this.card = card;
        this.properties = properties;
        this.handler = properties.handler || this.executeGameActions.bind(this);
    }

    createContext(player: Player = this.card.controller): AbilityContext {
        return new AbilityContext({
            ability: this,
            game: this.game,
            player: player,
            source: this.card,
            stage: Stages.PreTarget
        });
    }

    checkGameActionsForPotential(context: AbilityContext): boolean {
        if(super.checkGameActionsForPotential(context)) {
            return true;
        } else if(this.gameAction.every((gameAction: any) => gameAction.isOptional(context)) && this.properties.then) {
            const then =
                typeof this.properties.then === 'function' ? this.properties.then(context) : this.properties.then;
            const thenAbility = new ThenAbility(this.game, this.card, then);
            return thenAbility.meetsRequirements(thenAbility.createContext(context.player)) === '';
        }
        return false;
    }

    displayMessage(context: AbilityContext): void {
        let message = this.properties.message;
        if(typeof message === 'function') {
            message = message(context);
        }
        if(message) {
            let messageArgs: any[] = [context.player, context.source, context.target];
            if(this.properties.messageArgs) {
                let args = this.properties.messageArgs;
                if(typeof args === 'function') {
                    args = args(context);
                }
                messageArgs = messageArgs.concat(args);
            }
            this.game.addMessage(message, ...messageArgs);
        }
    }

    getGameActions(context: AbilityContext): any[] {
        // if there are any targets, look for gameActions attached to them
        const actions = this.targets.reduce((array: any[], target: any) => array.concat(target.getGameAction(context)), []);
        // look for a gameAction on the ability itself, on an attachment execute that action on its parent, otherwise on the card itself
        return actions.concat(this.gameAction);
    }

    executeHandler(context: AbilityContext): void {
        this.handler(context);
        this.game.queueSimpleStep(() => this.game.checkGameState());
    }

    executeGameActions(context: AbilityContext): void {
        context.events = [];
        const actions = this.getGameActions(context);
        let then = this.properties.then;
        if(then && typeof then === 'function') {
            then = then(context);
        }
        for(const action of actions) {
            this.game.queueSimpleStep(() => {
                action.addEventsToArray(context.events, context);
            });
        }
        this.game.queueSimpleStep(() => {
            const eventsToResolve = context.events.filter((event: any) => !event.cancelled && !event.resolved);
            if(eventsToResolve.length > 0) {
                const window = this.openEventWindow(eventsToResolve);
                if(then) {
                    window.addThenAbility(new ThenAbility(this.game, this.card, then), context, (then as ThenAbilityProperties).thenCondition);
                }
            } else if(then && (then as ThenAbilityProperties).thenCondition && (then as ThenAbilityProperties).thenCondition?.(context)) {
                const thenAbility = new ThenAbility(this.game, this.card, then as ThenAbilityProperties);
                this.game.resolveAbility(thenAbility.createContext(context.player));
            }
        });
    }

    openEventWindow(events: any[]): any {
        return this.game.openThenEventWindow(events);
    }

    isCardAbility(): boolean {
        return true;
    }
}

export = ThenAbility;
