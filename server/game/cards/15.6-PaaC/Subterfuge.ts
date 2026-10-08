import DrawCard from '../../DrawCard.js';
import { discardCard, draw, handler, sequentialContext } from '../../GameActions/GameActions.js';
import { Phase } from '../../Constants.js';

class Subterfuge extends DrawCard {
    static id = 'subterfuge';

    setupCardAbilities() {
        this.wouldInterrupt('Prevent draw')
            .when({
                onCardsDrawn: (event, context) => {
                    return (
                        context.player.opponent &&
                        context.player.isLessHonorable() &&
                        context.game.currentPhase !== Phase.Draw &&
                        event.player === context.player.opponent
                    );
                }
            })
            .cancel((context) => ({
                replacementGameAction: sequentialContext(() => {
                    const eventAmount = context.event.amount ?? 0;
                    const discardAmount = Math.min(eventAmount, 3);
                    const cardsToDiscard = context.player.opponent?.conflictDeck.slice(0, discardAmount);
                    const drawAmount = eventAmount - discardAmount;
                    return {
                        gameActions: [
                            discardCard({
                                target: cardsToDiscard
                            }),
                            handler({
                                handler: (context) => {
                                    context.game.addMessage(
                                        '{0} discards {1}',
                                        context.player.opponent,
                                        cardsToDiscard
                                    );
                                    if(drawAmount > 0) {
                                        context.game.addMessage(
                                            '{0} draws {1} card{2}',
                                            context.player.opponent,
                                            drawAmount,
                                            drawAmount > 1 ? 's' : ''
                                        );
                                    }
                                }
                            }),
                            draw({
                                target: context.player.opponent,
                                amount: drawAmount
                            })
                        ]
                    };
                })
            }))
            .effect('prevent {1} card{2} from being drawn, discarding {3} instead', (context) => {
                const amount = context.event.amount ?? 0;
                return [
                    Math.min(amount, 3),
                    amount > 1 ? 's' : '',
                    amount > 1 ? 'them' : 'it'
                ];
            });
    }
}


export default Subterfuge;
