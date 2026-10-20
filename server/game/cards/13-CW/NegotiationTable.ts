import { msg } from '../../GameChat.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { draw, gainFate, ready, selectCard } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type { HandlerMenuOption } from '../../gamesteps/HandlerMenuPrompt.js';
import type Player from '../../Player.js';
import type { Event } from '../../Events/Event.js';
import type { GameAction } from '../../GameActions/GameAction.js';

export default class NegotiationTable extends DrawCard {
    static id = 'negotiation-table';

    public override setupCardAbilities() {
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
        this.opponentThenYou(context, draw({ target: opponent }), draw({ target: context.player }));
    }

    private eachPlayerReadies(context: AbilityContext, opponent: Player) {
        this.game.addMessage(msg`${opponent} chooses to have each player ready a character`);
        this.opponentThenYou(
            context,
            selectCard((ctx) => ({
                player: Players.Opponent,
                cardType: CardType.Character,
                targets: true,
                message: (_context, card) => msg`${ctx.player.opponent} chooses to ready ${card}`,
                gameAction: ready()
            })),
            selectCard((ctx) => ({
                player: Players.Self,
                cardType: CardType.Character,
                targets: true,
                message: (_context, card) => msg`${ctx.player} chooses to ready ${card}`,
                gameAction: ready()
            }))
        );
    }

    private eachPlayerGainsFate(context: AbilityContext, opponent: Player) {
        this.game.addMessage(msg`${opponent} chooses to have each player gain a fate`);
        this.opponentThenYou(context, gainFate({ target: opponent }), gainFate({ target: context.player }));
    }

    /** You do the option only if the opponent's same option resolved. */
    private opponentThenYou(context: AbilityContext, theirs: GameAction, yours: GameAction) {
        if(!theirs.hasLegalTarget(context)) {
            return;
        }
        const events: Event[] = [];
        theirs.addEventsToArray(events, context);
        this.game.queueSimpleStep(() => this.game.openEventWindow(events));
        this.game.queueSimpleStep(() => {
            if(events.length > 0 && events.every((event) => event.isFullyResolved()) && yours.hasLegalTarget(context)) {
                yours.resolve(undefined, context);
            }
        });
    }
}
