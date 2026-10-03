import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class WindsOfChange extends DrawCard {
    static id = 'winds-of-change';

    setupCardAbilities() {
        this.action('Return the air ring to the unclaimed pool')
            .condition(() => this.game.rings.air.isClaimed())
            .gameAction(AbilityDsl.actions.returnRing(context => ({
                target: context.game.rings.air
            })))
            .effect('return the air ring to the unclaimed pool');
    }
}


export default WindsOfChange;
