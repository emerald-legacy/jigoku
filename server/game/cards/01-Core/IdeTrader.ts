import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { draw, gainFate } from '../../GameActions/GameActions.js';

class IdeTrader extends DrawCard {
    static id = 'ide-trader';

    setupCardAbilities() {
        this.reaction('Gain a fate/card')
            .when({
                onMoveToConflict: (_event, context) => context.source.isParticipating()
            })
            .select({}, {
                'Gain 1 fate': gainFate(),
                'Draw 1 card': draw()
            })
            .limit(AbilityDsl.limit.perConflict(1))
            .collectiveTrigger();
    }
}


export default IdeTrader;
