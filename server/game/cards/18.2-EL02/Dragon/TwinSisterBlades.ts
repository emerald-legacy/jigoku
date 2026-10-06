import DrawCard from '../../../DrawCard.js';
import { AbilityType } from '../../../Constants.js';
import { gainAbility } from '../../../effects.js';
import { draw } from '../../../GameActions/GameActions.js';
import type { AbilityContext } from '../../../AbilityContext.js';

class TwinSisterBlades extends DrawCard {
    static id = 'twin-sister-blades';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility(AbilityType.Action, {
                title: 'Draw cards',
                condition: (context) => context.source.isParticipating() && context.source.hasTrait('bushi'),
                effect: 'draw {1} card{2}',
                effectArgs: (context) => this.getNumberOfCards(context) === 2 ? ['2', 's'] : ['a', ''],
                gameAction: draw((context) => ({
                    amount: this.getNumberOfCards(context)
                }))
            })
        });
    }

    private getNumberOfCards(context: AbilityContext) {
        if(context.source.hasTrait('duelist') && context.game.requireConflict().hasMoreParticipants(context.player.opponent)) {
            return 2;
        }
        return 1;
    }
}


export default TwinSisterBlades;
