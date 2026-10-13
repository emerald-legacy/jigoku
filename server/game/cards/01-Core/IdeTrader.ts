import DrawCard from '../../DrawCard.js';
import { perConflict } from '../../AbilityLimit.js';
import { draw, gainFate } from '../../GameActions/GameActions.js';

class IdeTrader extends DrawCard {
    static id = 'ide-trader';

    setupCardAbilities() {
        this.reaction('Gain a fate/card')
            .when({
                onMoveToConflict: (_event, context) => context.source.isParticipating()
            })
            .collectiveTrigger()
            .select({}, {
                'Gain 1 fate': gainFate(),
                'Draw 1 card': draw()
            })
            .limit(perConflict(1));
    }
}


export default IdeTrader;
