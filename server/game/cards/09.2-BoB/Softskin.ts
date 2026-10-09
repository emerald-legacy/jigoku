import DrawCard from '../../DrawCard.js';
import { unlessActionCost } from '../../effects.js';
import { discardCard } from '../../GameActions/GameActions.js';

class Softskin extends DrawCard {
    static id = 'softskin';

    setupCardAbilities() {
        this.whileAttached({
            effect: unlessActionCost({
                actionName: 'ready',
                cost: (card) => discardCard({ target: card.controller.conflictDeck.length > 2 ? card.controller.conflictDeck.slice(0, 3) : [] })
            })
        });
    }
}


export default Softskin;
