import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { dishonor, handler, honor, loseFate, selectCard } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { FateBidPrompt, type Result } from '../../../gamesteps/FateBidPrompt.js';
import { SimpleStep } from '../../../gamesteps/SimpleStep.js';
import type Player from '../../../Player.js';

function resolveActionOnSelection(context: AbilityContext, player: Player, action: 'honor' | 'dishonor') {
    const playerEnum = player === context.player ? Players.Self : Players.Opponent;
    selectCard({
        player: playerEnum,
        controller: Players.Any,
        cardType: CardType.Character,
        gameAction: action === 'honor' ? honor() : dishonor(),
        message: (_context, card, chooser) => msg`${chooser} ${action}s ${card}`
    })
        .resolve(player, context);
}

export default class GloryOfTheFiveRivers extends DrawCard {
    static id = 'glory-of-the-five-rivers';

    public setupCardAbilities() {
        this.action('Honor a character and dishonor a character')
            .condition((context) => context.player.isTraitInPlay('courtier'))
            .gameAction(handler({
                handler: (context) => {
                    let bidResult: Result;

                    context.game.queueStep(
                        new FateBidPrompt(context.game, 'Choose an amount of fate', (result, context) => {
                            bidResult = result;
                            for(const [player, amount] of result.bids) {
                                context.game.addMessage(msg`${player} spends ${amount} fate`);
                                loseFate({ amount, target: player }).resolve(player, context);
                            }
                        })
                    );

                    context.game.queueStep(
                        new SimpleStep(context.game, () => {
                            if(bidResult.highest.players.size === 1) {
                                for(const winner of bidResult.highest.players) {
                                    resolveActionOnSelection(context, winner, 'dishonor');
                                    resolveActionOnSelection(context, winner, 'honor');
                                }
                            }
                        })
                    );
                }
            }))
            .chatText('collect offerings');
    }
}
