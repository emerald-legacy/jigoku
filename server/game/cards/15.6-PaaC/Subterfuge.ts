import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { chatMessage, chooseAmount, discardCard, draw, sequential } from '../../GameActions/GameActions.js';
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
            // "up to 3": the player picks how many of the drawn cards are discarded
            .cancel((context) => ({
                replacementGameAction: chooseAmount({
                    activePromptTitle: 'Choose how many cards to discard',
                    max: Math.min(context.event.amount ?? 0, 3),
                    gameAction: (discardAmount) => sequential(() => {
                        const eventAmount = context.event.amount ?? 0;
                        const cardsToDiscard = context.player.opponent?.conflictDeck.slice(0, discardAmount);
                        const drawAmount = eventAmount - discardAmount;
                        return [
                            discardCard({
                                target: cardsToDiscard
                            }),
                            chatMessage((context) => msg`${context.player.opponent} discards ${cardsToDiscard}`),
                            chatMessage((context) => drawAmount > 0 ? msg`${context.player.opponent} draws ${drawAmount} card${drawAmount > 1 ? 's' : ''}` : undefined),
                            draw({
                                target: context.player.opponent,
                                amount: drawAmount
                            })
                        ];
                    })
                })
            }))
            .chatText((context) => {
                const amount = context.event.amount ?? 0;
                return amount > 1
                    ? msg`prevent up to ${Math.min(amount, 3)} cards from being drawn, discarding them instead`
                    : msg`prevent 1 card from being drawn, discarding it instead`;
            });
    }
}


export default Subterfuge;
