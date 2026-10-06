import DrawCard from '../../DrawCard.js';
import { ready } from '../../GameActions/GameActions.js';
import { Stage } from '../../Constants.js';

class ShiotomeHeroine extends DrawCard {
    static id = 'shiotome-heroine';

    setupCardAbilities() {
        this.reaction('Ready this character')
            .when({
                onModifyHonor: (event, context) =>
                    event.amount > 0 && event.player === context.player.opponent && event.context?.stage === Stage.Effect
            })
            .gameAction(ready());
    }
}


export default ShiotomeHeroine;
