import { Duration, Location } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { gainActionPhasePriority, playerDelayedEffect } from '../../../effects.js';
import { handler, playerLastingEffect, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { shuffle } from '../../../utils/shuffle.js';

export default class SneakAttack extends DrawCard {
    static id = 'sneak-attack';

    private setAsideCards: DrawCard[] = [];

    public setupCardAbilities() {
        this.reaction('The attacker gets the first action opportunity')
            .when({
                onConflictStarted: (event, context) => event.conflict.attackingPlayer === context.player
            })
            .cost(costs.payHonor(1))
            .gameAction(sequential([
                handler({
                    handler: (context) => {
                        const opponent = context.player.opponent;
                        if(!opponent || opponent.hand.length === 0) {
                            return;
                        }

                        this.setAsideCards = shuffle(opponent.hand).slice(0, 2);
                        this.game.addMessage('{0} sets aside {1}', opponent, this.setAsideCards);
                        for(const card of this.setAsideCards) {
                            opponent.moveCard(card, Location.RemovedFromGame);
                        }
                    }
                }),
                playerLastingEffect((context) => ({
                    duration: Duration.UntilEndOfRound,
                    targetController: context.player.opponent,
                    effect: playerDelayedEffect({
                        when: { onConflictFinished: () => true },
                        gameAction: handler({
                            handler: (context) => {
                                if(this.setAsideCards.length === 0) {
                                    return;
                                }
                                const opponent = this.setAsideCards[0].owner;
                                context.game.addMessage('{0} picks back their cards', opponent);
                                for(const card of this.setAsideCards) {
                                    opponent.moveCard(card, Location.Hand);
                                }
                                this.setAsideCards = [];
                            }
                        })
                    })
                })),
                playerLastingEffect((context) => ({
                    targetController: context.player,
                    effect: gainActionPhasePriority()
                }))
            ]))
            .effect('give {1} the first action in this conflict{2}', (context) => [
                context.player,
                (context.player.opponent?.hand.length ?? 0) > 0 ? ' and set aside opponent\'s cards' : ''
            ]);
    }
}
