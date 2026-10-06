import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { chosenDiscard, draw, sequential } from '../../GameActions/GameActions.js';

class HidaSukune extends DrawCard {
    static id = 'hida-sukune';

    setupCardAbilities() {
        this.action('Draw and discard a card')
            .condition(context => context.source.isDefending())
            .gameAction(sequential([
                draw(context => ({
                    target: context.player
                })),
                chosenDiscard(context => ({
                    target: context.player
                }))
            ]))
            .limit(AbilityDsl.limit.perConflict(1));
    }
}


export default HidaSukune;

