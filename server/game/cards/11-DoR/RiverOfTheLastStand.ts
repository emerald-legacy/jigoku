import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { defendingAtKaiuWall } from '../kaiuWall.js';

class RiverOfTheLastStand extends DrawCard {
    static id = 'river-of-the-last-stand';

    setupCardAbilities() {
        this.action('Make opponent discard two cards and draw a card')
            .condition(context => defendingAtKaiuWall(context.player, context.game.currentConflict))
            .gameAction(AbilityDsl.actions.sequential([
                AbilityDsl.actions.discardAtRandom(context => ({
                    target: context.player.opponent,
                    amount: 2
                })),
                AbilityDsl.actions.draw(context => ({
                    target: context.player.opponent,
                    amount: 1
                }))
            ]));
    }
}


export default RiverOfTheLastStand;
