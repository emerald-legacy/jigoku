import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { dishonor, handler, honor, loseFate, selectCard } from '../../../GameActions/GameActions.js';
import { CardType, Players, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { FateBidPrompt, type Result } from '../../../gamesteps/FateBidPrompt.js';
import { SimpleStep } from '../../../gamesteps/SimpleStep.js';
import type Player from '../../../Player.js';
import type { Event } from '../../../Events/Event.js';

function selection(context: AbilityContext, player: Player, action: 'honor' | 'dishonor') {
    return selectCard({
        player: player === context.player ? Players.Self : Players.Opponent,
        controller: Players.Any,
        cardType: CardType.Character,
        gameAction: action === 'honor' ? honor() : dishonor(),
        message: (_context, card, chooser) => msg`${chooser} ${action}s ${card}`
    });
}

export default class GloryOfTheFiveRivers extends DrawCard {
    static id = 'glory-of-the-five-rivers';

    public override setupCardAbilities() {
        this.action('Honor a character and dishonor a character')
            .ifCondition((context) => context.player.isTraitInPlay(Trait.Courtier))
            .gameAction(handler({
                handler: (context) => {
                    let bidResult: Result;

                    context.game.queueStep(
                        new FateBidPrompt(context.game, 'Choose an amount of fate', (result) => {
                            bidResult = result;
                            for(const [player, amount] of result.bids) {
                                context.game.addMessage(msg`${player} spends ${amount} fate`);
                                loseFate({ amount, spend: true }).resolve(player, context);
                            }
                        })
                    );

                    context.game.queueStep(
                        new SimpleStep(context.game, () => {
                            if(bidResult.highest.players.size === 1) {
                                for(const winner of bidResult.highest.players) {
                                    const dishonorEvents: Event[] = [];
                                    selection(context, winner, 'dishonor').addEventsToArray(dishonorEvents, context, { target: winner });
                                    context.game.queueSimpleStep(() => context.game.openEventWindow(dishonorEvents));
                                    context.game.queueSimpleStep(() => {
                                        if(dishonorEvents.length > 0 && dishonorEvents.every((event) => event.isFullyResolved())) {
                                            selection(context, winner, 'honor').resolve(winner, context);
                                        }
                                    });
                                }
                            }
                        })
                    );
                }
            }))
            .chatText('collect offerings');
    }
}
