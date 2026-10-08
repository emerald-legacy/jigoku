import { msg } from '../../GameChat.js';
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
                                    context.game.addMessage(msg`${context.player.opponent} discards ${cardsToDiscard}`);
                                    if(drawAmount > 0) {
                                        context.game.addMessage(msg`${context.player.opponent} draws ${drawAmount} card${drawAmount > 1 ? 's' : ''}`);
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
            .chatText((context) => {
                const amount = context.event.amount ?? 0;
                return msg`prevent ${Math.min(amount, 3)} card${amount > 1 ? 's' : ''} from being drawn, discarding ${amount > 1 ? 'them' : 'it'} instead`;
            });
    }
}


export default Subterfuge;
