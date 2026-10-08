import { msg } from '../../../GameChat.js';
import { CardType, Duration, Location } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { playerDelayedEffect } from '../../../effects.js';
import { handler, lookAt, playerLastingEffect, sequentialContext } from '../../../GameActions/GameActions.js';
import { shuffle } from '../../../utils/random.js';

export default class EaglesRestPeak extends ProvinceCard {
    static id = 'eagle-s-rest-peak';

    public setupCardAbilities() {
        this.action('Look at random cards from opponent\'s hand')
            .condition((context) => (context.player.opponent?.hand.length ?? 0) > 0)
            .target({
                activePromptTitle: 'Choose a character to lead the investigation',
                cardType: CardType.Character,
                cardCondition: (card) => card.isDefending() && (card.getCost() ?? 0) > 0
            })
            .gameAction(sequentialContext((context) => {
                const opponent = context.player.opponent;
                const setAsideCards = shuffle(opponent?.hand ?? [])
                    .slice(0, context.target.getCost() ?? 0);

                return {
                    gameActions: [
                        lookAt({ target: setAsideCards }),

                        handler({
                            handler: () => {
                                this.game.addMessage(msg`${opponent} sets aside ${setAsideCards}`);
                                if(opponent) {
                                    for(const card of setAsideCards) {
                                        opponent.moveCard(card, Location.RemovedFromGame);
                                    }
                                }
                            }
                        }),

                        playerLastingEffect({
                            duration: Duration.UntilEndOfRound,
                            targetController: opponent,
                            effect: playerDelayedEffect({
                                when: { onConflictFinished: () => true },
                                gameAction: handler({
                                    handler: (context) => {
                                        context.game.addMessage(msg`${opponent} picks back their cards`);
                                        if(opponent) {
                                            for(const card of setAsideCards) {
                                                opponent.moveCard(card, Location.Hand);
                                            }
                                        }
                                    }
                                })
                            })
                        })
                    ]
                };
            }))
            .chatText((context) => msg`use the insight of ${context.chatTarget()}, revealing and setting aside ${context.target.getCost() ?? 0} cards from ${context.player.opponent}'s hand`);
    }
}
