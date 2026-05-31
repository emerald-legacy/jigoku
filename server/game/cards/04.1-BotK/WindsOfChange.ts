import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class WindsOfChange extends DrawCard {
    static id = 'winds-of-change';

    setupCardAbilities() {
        this.action({
            condition: () => this.game.rings.air.isClaimed(),
            title: 'Return the air ring to the unclaimed pool',
            effect: 'return the air ring to the unclaimed pool',
            gameAction: AbilityDsl.actions.returnRing(context => ({
                target: context.game.rings.air
            }))
        });
    }
}


export default WindsOfChange;
