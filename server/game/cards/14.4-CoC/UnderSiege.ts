import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, Duration } from '../../Constants.js';
import { perConflict } from '../../AbilityLimit.js';
import { playerDelayedEffect } from '../../effects.js';
import {
    chatMessage,
    chosenDiscard,
    conditional,
    draw,
    moveCard,
    noAction,
    playerLastingEffect,
    sequential,
    setAside
} from '../../GameActions/GameActions.js';

class UnderSiege extends DrawCard {
    static id = 'under-siege';

    override setupCardAbilities() {
        this.reaction('Place defender under siege')
            .when({
                // RRG appendix: with no cards in the defender's hand it can't be played
                onConflictDeclared: (_event, context) =>
                    context.game.currentConflict !== null &&
                    context.game.currentConflict.defendingPlayer !== null &&
                    context.game.currentConflict.defendingPlayer.hand.length > 0
            })
            .gameAction(sequential((context) => {
                const defender = context.game.currentConflict?.defendingPlayer ?? undefined;
                const hand = defender ? [...defender.hand] : [];
                const setAsideHand = () => hand.filter((card) => card.location === Location.RemovedFromGame);
                return [
                    playerLastingEffect({
                        duration: Duration.UntilEndOfRound,
                        target: defender,
                        effect: playerDelayedEffect({
                            when: {
                                onConflictFinished: () => true
                            },
                            gameAction: sequential([
                                chosenDiscard(() => ({
                                    amount: 1000 //discard the entire hand
                                })),
                                chatMessage(() => setAsideHand().length > 0 ? msg`${defender} picks up their original hand` : undefined),
                                moveCard(() => ({ target: setAsideHand(), destination: Location.Hand }))
                            ])
                        })
                    }),
                    setAside({
                        target: hand,
                        hidden: true,
                        message: () => msg`${defender} sets their hand aside and draws 5 cards`
                    }),
                    conditional({
                        condition: hand.length > 0,
                        trueGameAction: draw({ target: defender, amount: 5 }),
                        falseGameAction: noAction()
                    })
                ];
            }))
            .chatText((context) => msg`place ${context.game.currentConflict ? context.game.currentConflict.defendingPlayer : ''} under siege`)
            .max(perConflict(1));
    }
}


export default UnderSiege;
