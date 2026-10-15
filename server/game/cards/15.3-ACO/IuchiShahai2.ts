import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { addKeyword } from '../../effects.js';

class IuchiShahai2 extends DrawCard {
    static id = 'iuchi-shahai-2';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => this.game.getFirstPlayer() === context.player,
            effect: addKeyword('covert')
        });

        this.reaction('Place 1 fate on this character')
            .when({
                onCardPlayed: (event, context) => (event.card.hasTrait('meishodo') || event.card.hasTrait('maho')) && event.player === context.player
            })
            .cost(costs.payHonor(1))
            .placeFate();
    }
}


export default IuchiShahai2;
