import DrawCard from '../../DrawCard.js';
import { discardAtRandom, draw, sequential } from '../../GameActions/GameActions.js';
import { defendingAtKaiuWall } from '../kaiuWall.js';

class RiverOfTheLastStand extends DrawCard {
    static id = 'river-of-the-last-stand';

    setupCardAbilities() {
        this.action('Make opponent discard two cards and draw a card')
            .condition(context => defendingAtKaiuWall(context.player, context.game.currentConflict))
            .gameAction(sequential([
                discardAtRandom(context => ({
                    target: context.player.opponent,
                    amount: 2
                })),
                draw(context => ({
                    target: context.player.opponent
                }))
            ]));
    }
}


export default RiverOfTheLastStand;
