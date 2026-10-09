import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { honor, multiple, ready } from '../../../GameActions/GameActions.js';

class NoBreathWasted extends DrawCard {
    static id = 'no-breath-wasted';

    setupCardAbilities() {
        this.action('Ready character')
            .cost(costs.sacrifice({ cardType: CardType.Character }))
            .target({
                activePromptTitle: 'Choose a character to ready',
                cardType: CardType.Character
            }, multiple([
                ready(),
                honor((context) => ({ target: context.target.controller !== context.player ? context.target : [] }))
            ]));
    }
}


export default NoBreathWasted;
