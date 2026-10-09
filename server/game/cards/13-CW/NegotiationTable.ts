import { msg } from '../../GameChat.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { draw, gainFate, ready, selectCard } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type { HandlerMenuOption } from '../../gamesteps/HandlerMenuPrompt.js';
import type Player from '../../Player.js';

export default class NegotiationTable extends DrawCard {
    static id = 'negotiation-table';

    public setupCardAbilities() {
        this.action('Make opponent pick from several options')
            .condition((context) => context.player.opponent !== undefined)
            .handler((context) => {
                const opponent = context.player.opponent;
                if(!opponent) {
                    return;
                }
                const options: HandlerMenuOption[] = [];
                const prompt = () => this.game.promptWithHandlerMenu(opponent, {
                    activePromptTitle: 'Choose an action',
                    source: this,
                    options
                });
                // each option except Done can be picked once
                const once = (text: string, resolve: () => void): HandlerMenuOption => {
                    const option: HandlerMenuOption = {
                        text,
                        handler: () => {
                            options.splice(options.indexOf(option), 1);
                            resolve();
                            prompt();
                        }
                    };
                    return option;
                };
                options.push(
                    once('Draw 1 card', () => this.eachPlayerDraws(context, opponent)),
                    once('Choose and ready a character', () => this.eachPlayerReadies(context, opponent)),
                    once('Gain 1 fate', () => this.eachPlayerGainsFate(context, opponent)),
                    { text: 'Done', handler: () => this.game.addMessage(msg`${opponent} chooses not to do an action`) }
                );
                prompt();
            });
    }

    private eachPlayerDraws(context: AbilityContext, opponent: Player) {
        this.game.addMessage(msg`${opponent} chooses to have each player draw a card`);

        draw((ctx) => ({
            target: ctx.player.opponent
        }))
            .resolve(opponent, context);
        draw((ctx) => ({
            target: ctx.player
        }))
            .resolve(context.player, context);
    }

    private eachPlayerReadies(context: AbilityContext, opponent: Player) {
        this.game.addMessage(msg`${opponent} chooses to have each player ready a character`);
        const bowedCharacters =
            context.player.cardsInPlay.filter((a) => a.type === CardType.Character && a.bowed).length +
            opponent.cardsInPlay.filter((a) => a.type === CardType.Character && a.bowed).length;

        if(bowedCharacters > 0) {
            selectCard((ctx) => ({
                player: Players.Opponent,
                cardType: CardType.Character,
                targets: true,
                message: (_context, card) => msg`${ctx.player.opponent} chooses to ready ${card}`,
                gameAction: ready()
            }))
                .resolve(opponent, context);
        }

        //This is ugly, but it's needed to not deadlock the game
        if(bowedCharacters > 1) {
            selectCard((ctx) => ({
                player: Players.Self,
                cardType: CardType.Character,
                targets: true,
                message: (_context, card) => msg`${ctx.player} chooses to ready ${card}`,
                gameAction: ready()
            }))
                .resolve(context.player, context);
        }
    }

    private eachPlayerGainsFate(context: AbilityContext, opponent: Player) {
        this.game.addMessage(msg`${opponent} chooses to have each player gain a fate`);

        gainFate((ctx) => ({
            target: ctx.player.opponent
        }))
            .resolve(opponent, context);
        gainFate((ctx) => ({
            target: ctx.player
        }))
            .resolve(context.player, context);
    }
}
