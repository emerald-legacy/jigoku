import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { draw } from '../../GameActions/GameActions.js';
import { defendingAtKaiuWall } from '../kaiuWall.js';

class WatchtowerOfValor extends DrawCard {
    static id = 'watchtower-of-valor';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player && defendingAtKaiuWall(context.player, event.conflict)
            })
            .gameAction(draw())
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default WatchtowerOfValor;
