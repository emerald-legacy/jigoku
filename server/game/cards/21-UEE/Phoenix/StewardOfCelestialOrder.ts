import * as costs from '../../../costs/index.js';
import { canContributeGloryWhileBowed } from '../../../effects.js';
import { gainHonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class StewardOfCelestialOrder extends DrawCard {
    static id = 'steward-of-celestial-order';

    setupCardAbilities() {
        this.persistentEffect({
            effect: canContributeGloryWhileBowed()
        });

        this.action('Return rings to gain honor')
            .cost(costs.returnRings())
            .gameAction(gainHonor((context) => ({
                amount: context.costs.returnRing ? context.costs.returnRing.length : 1
            })));
    }
}
