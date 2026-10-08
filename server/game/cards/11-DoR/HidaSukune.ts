import DrawCard from '../../DrawCard.js';
import { perConflict } from '../../AbilityLimit.js';
import { chosenDiscard, draw, sequential } from '../../GameActions/GameActions.js';

class HidaSukune extends DrawCard {
    static id = 'hida-sukune';

    setupCardAbilities() {
        this.action('Draw and discard a card')
            .condition((context) => context.source.isDefending())
            .gameAction(sequential([
                draw((context) => ({
                    target: context.player
                })),
                chosenDiscard((context) => ({
                    target: context.player
                }))
            ]))
            .limit(perConflict(1));
    }
}


export default HidaSukune;

