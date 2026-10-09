import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';
import { gainAbility } from '../../../effects.js';
import type { AbilityContext } from '../../../AbilityContext.js';

class TwinSisterBlades extends DrawCard {
    static id = 'twin-sister-blades';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.action('Draw cards', (ability) => ability
                .condition((context) => context.source.isParticipating() && context.source.hasTrait('bushi'))
                .draw((context) => ({
                    amount: this.getNumberOfCards(context)
                }))
                .chatText((context) => this.getNumberOfCards(context) === 2 ? msg`draw 2 card${'s'}` : msg`draw a card`))
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
