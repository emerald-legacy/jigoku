import DrawCard from '../../DrawCard.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { defendingAtKaiuWall } from '../kaiuWall.js';

class WatchtowerOfValor extends DrawCard {
    static id = 'watchtower-of-valor';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player && defendingAtKaiuWall(context.player, event.conflict)
            })
            .draw()
            .limit(unlimitedPerConflict());
    }
}


export default WatchtowerOfValor;
