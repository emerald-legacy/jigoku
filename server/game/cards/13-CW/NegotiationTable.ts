import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players } from '../../Constants.js';
import DrawCard from '../../drawcard.js';

export default class NegotiationTable extends DrawCard {
    static id = 'negotiation-table';

    public setupCardAbilities() {
        this.action({
            title: 'Make opponent pick from several options',
            condition: (context) => context.player.opponent !== undefined,
            handler: (context: AbilityContext) => {
                let choices: string[] = [];
                let handlers: (() => void)[] = [];

                let drawChoice = 'Draw 1 card';
                let drawHandler = () => {
                    choices.splice(choices.indexOf(drawChoice), 1);
                    handlers.splice(handlers.indexOf(drawHandler), 1);
                    this.getDrawChoice(context);
                    this.getHandlerMenu(context, choices, handlers);
                };
                let readyChoice = 'Choose and ready a character';
                let readyHandler = () => {
                    choices.splice(choices.indexOf(readyChoice), 1);
                    handlers.splice(handlers.indexOf(readyHandler), 1);
                    this.getReadyChoice(context);
                    this.getHandlerMenu(context, choices, handlers);
                };
                let fateChoice = 'Gain 1 fate';
                let fateHandler = () => {
                    choices.splice(choices.indexOf(fateChoice), 1);
                    handlers.splice(handlers.indexOf(fateHandler), 1);
                    this.getFateChoice(context);
                    this.getHandlerMenu(context, choices, handlers);
                };
                let doneChoice = 'Done';
                let doneHandler = () => {
                    this.getDoneChoice(context);
                };

                choices.push(drawChoice);
                choices.push(readyChoice);
                choices.push(fateChoice);
                choices.push(doneChoice);

                handlers.push(drawHandler);
                handlers.push(readyHandler);
                handlers.push(fateHandler);
                handlers.push(doneHandler);

                this.getHandlerMenu(context, choices, handlers);
            }
        });
    }

    getHandlerMenu(context: AbilityContext, choices: string[], handlers: (() => void)[]) {
        if(!context.player.opponent) {
            return;
        }
        this.game.promptWithHandlerMenu(context.player.opponent, {
            activePromptTite: 'Choose an action',
            source: this,
            choices: choices,
            handlers: handlers
        });
    }

    getDrawChoice(context: AbilityContext) {
        if(!context.player.opponent) {
            return;
        }
        this.game.addMessage('{0} chooses to have each player draw a card', context.player.opponent);

        const opponent = context.player.opponent;
        AbilityDsl.actions
            .draw((ctx: AbilityContext) => ({
                target: ctx.player.opponent,
                amount: 1
            }))
            .resolve(opponent, context);
        AbilityDsl.actions
            .draw((ctx: AbilityContext) => ({
                target: ctx.player,
                amount: 1
            }))
            .resolve(context.player, context);
    }

    getReadyChoice(context: AbilityContext) {
        if(!context.player.opponent) {
            return;
        }
        const opponent = context.player.opponent;
        this.game.addMessage('{0} chooses to have each player ready a character', opponent);
        let bowedCharacters =
            context.player.cardsInPlay.filter((a: DrawCard) => a.type === CardTypes.Character && a.bowed).length +
            opponent.cardsInPlay.filter((a: DrawCard) => a.type === CardTypes.Character && a.bowed).length;

        if(bowedCharacters > 0) {
            AbilityDsl.actions
                .selectCard((ctx: AbilityContext) => ({
                    player: Players.Opponent,
                    cardType: CardTypes.Character,
                    targets: true,
                    message: '{0} chooses to ready {1}',
                    messageArgs: (card: any) => [ctx.player.opponent, card],
                    gameAction: AbilityDsl.actions.ready()
                }))
                .resolve(opponent, context);
        }

        //This is ugly, but it's needed to not deadlock the game
        if(bowedCharacters > 1) {
            AbilityDsl.actions
                .selectCard((ctx: AbilityContext) => ({
                    player: Players.Self,
                    cardType: CardTypes.Character,
                    targets: true,
                    message: '{0} chooses to ready {1}',
                    messageArgs: (card: any) => [ctx.player, card],
                    gameAction: AbilityDsl.actions.ready()
                }))
                .resolve(context.player, context);
        }
    }

    getFateChoice(context: AbilityContext) {
        if(!context.player.opponent) {
            return;
        }
        const opponent = context.player.opponent;
        this.game.addMessage('{0} chooses to have each player gain a fate', opponent);

        AbilityDsl.actions
            .gainFate((ctx: AbilityContext) => ({
                target: ctx.player.opponent,
                amount: 1
            }))
            .resolve(opponent, context);
        AbilityDsl.actions
            .gainFate((ctx: AbilityContext) => ({
                target: ctx.player,
                amount: 1
            }))
            .resolve(context.player, context);
    }

    getDoneChoice(context: AbilityContext) {
        this.game.addMessage('{0} chooses not to do an action', context.player.opponent);
        return true;
    }
}
