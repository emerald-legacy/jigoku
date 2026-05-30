import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Phases } from '../../Constants.js';

class Subterfuge extends DrawCard {
    static id = 'subterfuge';
    private messageShown?: boolean;

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent draw',
            when: {
                onCardsDrawn: (event, context) => {
                    return (
                        context.player.opponent &&
                        context.player.isLessHonorable() &&
                        context.game.currentPhase !== Phases.Draw &&
                        event.player === context.player.opponent
                    );
                }
            },
            gameAction: AbilityDsl.actions.cancel((context) => ({
                replacementGameAction: AbilityDsl.actions.sequentialContext(() => {
                    const eventAmount = context.event.amount ?? 0;
                    const discardAmount = Math.min(eventAmount, 3);
                    const cardsToDiscard = context.player.opponent.conflictDeck.slice(0, discardAmount);
                    const drawAmount = eventAmount - discardAmount;
                    this.messageShown = false;
                    return {
                        gameActions: [
                            AbilityDsl.actions.discardCard({
                                target: cardsToDiscard
                            }),
                            AbilityDsl.actions.handler({
                                handler: (context) => {
                                    if(!this.messageShown) {
                                        // for some reason, it shows the message twice
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
                                        this.messageShown = true;
                                    }
                                }
                            }),
                            AbilityDsl.actions.draw({
                                target: context.player.opponent,
                                amount: drawAmount
                            })
                        ]
                    };
                })
            })),
            effect: 'prevent {1} card{2} from being drawn, discarding {3} instead',
            effectArgs: (context) => {
                const amount = context.event.amount ?? 0;
                return [
                    Math.min(amount, 3),
                    amount > 1 ? 's' : '',
                    amount > 1 ? 'them' : 'it'
                ];
            }
        });
    }
}


export default Subterfuge;
