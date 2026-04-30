import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';

class Softskin extends DrawCard {
    static id = 'softskin';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.unlessActionCost({
                actionName: 'ready',
                cost: card => AbilityDsl.actions.discardCard({ target: card.controller.conflictDeck.length > 2 ? card.controller.conflictDeck.slice(0, 3) : [] })
            })
        });
    }
}


export default Softskin;
