import DrawCard from '../../../DrawCard.js';
import { AbilityTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type { Conflict } from '../../../Conflict.js';

class TwinSisterBlades extends DrawCard {
    static id = 'twin-sister-blades';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Draw cards',
                condition: (context: any) => context.source.isParticipating() && context.source.hasTrait('bushi'),
                effect: 'draw {1} card{2}',
                effectArgs: (context: any) => this.getNumberOfCards(context) === 2 ? ['2', 's'] : ['a', ''],
                gameAction: AbilityDsl.actions.draw((context: any) => ({
                    target: context.player,
                    amount: this.getNumberOfCards(context)
                }))
            })
        });
    }

    getNumberOfCards(context: AbilityContext) {
        if(context.source.hasTrait('duelist') && (context.game.currentConflict as Conflict).hasMoreParticipants(context.player.opponent)) {
            return 2;
        }
        return 1;
    }
}


export default TwinSisterBlades;
