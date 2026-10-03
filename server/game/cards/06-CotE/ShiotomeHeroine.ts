import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Stage } from '../../Constants.js';

class ShiotomeHeroine extends DrawCard {
    static id = 'shiotome-heroine';

    setupCardAbilities() {
        this.reaction('Ready this character')
            .when({
                onModifyHonor: (event, context) =>
                    (event.amount ?? 0) > 0 && context.player.opponent &&
                    event.player === context.player.opponent && event.context?.stage === Stage.Effect
            })
            .gameAction(AbilityDsl.actions.ready());
    }
}


export default ShiotomeHeroine;
