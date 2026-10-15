import DrawCard from '../../DrawCard.js';
import { Stage } from '../../Constants.js';

class ShiotomeHeroine extends DrawCard {
    static id = 'shiotome-heroine';

    setupCardAbilities() {
        this.reaction('Ready this character')
            .when({
                onModifyHonor: (event, context) =>
                    event.amount > 0 && event.player === context.player.opponent && event.context?.stage === Stage.Effect,
                // the opponent takes honor from you (not the honor bid, a framework effect)
                onTransferHonor: (event, context) =>
                    event.amount > 0 && event.player === context.player && !event.afterBid && event.context?.stage === Stage.Effect
            })
            .ready();
    }
}


export default ShiotomeHeroine;
