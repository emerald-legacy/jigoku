import DrawCard from '../../DrawCard.js';
import { discardAtRandom } from '../../GameActions/GameActions.js';

class QuarrelsomeYouth extends DrawCard {
    static id = 'quarrelsome-youth';

    setupCardAbilities() {
        this.reaction('Force opponent to discard a card')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.loser === context.player &&
                    context.source.isAttacking() &&
                    context.player.opponent &&
                    context.player.hand.length < context.player.opponent.hand.length
            })
            .gameAction(discardAtRandom());
    }
}


export default QuarrelsomeYouth;
