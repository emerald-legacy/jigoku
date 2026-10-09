import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, Duration } from '../../Constants.js';
import { perConflict } from '../../AbilityLimit.js';
import { playerDelayedEffect } from '../../effects.js';
import {
    chosenDiscard,
    conditional,
    draw,
    handler,
    noAction,
    playerLastingEffect,
    sequential,
    sequentialContext,
    setAside
} from '../../GameActions/GameActions.js';

class UnderSiege extends DrawCard {
    static id = 'under-siege';

    setupCardAbilities() {
        this.reaction('Place defender under siege')
            .when({
                onConflictDeclared: (_event, context) => context.game.currentConflict !== null && context.game.currentConflict.defendingPlayer !== null
            })
            .gameAction(sequentialContext((context) => {
                const defender = context.game.currentConflict?.defendingPlayer ?? undefined;
                const hand = defender ? [...defender.hand] : [];
                return {
                    gameActions: [
                        playerLastingEffect({
                            duration: Duration.UntilEndOfRound,
                            targetController: defender,
                            effect: playerDelayedEffect({
                                when: {
                                    onConflictFinished: () => true
                                },
                                gameAction: sequential([
                                    chosenDiscard(() => ({
                                        amount: 1000 //discard the entire hand
                                    })),
                                    handler({
                                        handler: (context) => {
                                            const setAside = hand.filter((card) => card.location === Location.RemovedFromGame);
                                            if(defender && setAside.length > 0) {
                                                context.game.addMessage(msg`${defender} picks up their original hand`);
                                                setAside.forEach((card) => defender.moveCard(card, Location.Hand));
                                            }
                                        }
                                    })
                                ])
                            })
                        }),
                        setAside({
                            target: hand,
                            hidden: true,
                            message: () => msg`${defender} sets their hand aside and draws 5 cards`
                        }),
                        // "If they do"
                        conditional({
                            condition: hand.length > 0,
                            trueGameAction: draw({ target: defender, amount: 5 }),
                            falseGameAction: noAction()
                        })
                    ]
                };
            }))
            .chatText((context) => msg`place ${context.game.currentConflict ? context.game.currentConflict.defendingPlayer : ''} under siege`)
            .max(perConflict(1));
    }
}


export default UnderSiege;
