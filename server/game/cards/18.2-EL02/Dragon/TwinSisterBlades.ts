import DrawCard from '../../../DrawCard.js';
import { AbilityType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type { Conflict } from '../../../Conflict.js';

class TwinSisterBlades extends DrawCard {
    static id = 'twin-sister-blades';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Draw cards',
                condition: (context: AbilityContext) => (context.source as DrawCard).isParticipating() && context.source.hasTrait('bushi'),
                effect: 'draw {1} card{2}',
                effectArgs: (context: AbilityContext) => this.getNumberOfCards(context) === 2 ? ['2', 's'] : ['a', ''],
                gameAction: AbilityDsl.actions.draw((context: AbilityContext) => ({
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
