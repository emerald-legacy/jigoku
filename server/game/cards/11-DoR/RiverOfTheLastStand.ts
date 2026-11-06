import DrawCard from '../../DrawCard.js';
import { discardAtRandom, draw } from '../../GameActions/GameActions.js';
import { defendingAtKaiuWall } from '../kaiuWall.js';

class RiverOfTheLastStand extends DrawCard {
    static id = 'river-of-the-last-stand';

    override setupCardAbilities() {
        this.action('Make opponent discard two cards and draw a card')
            .condition((context) => defendingAtKaiuWall(context.player, context.game.currentConflict))
            .gameAction(discardAtRandom((context) => ({
                target: context.player.opponent,
                amount: 2
            })))
            .then()
            .gameAction(draw((context) => ({
                target: context.player.opponent
            })));
    }
}


export default RiverOfTheLastStand;
