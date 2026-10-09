import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { addTrait } from '../../effects.js';
import { captureParentCost } from '../captureParentCost.js';

class SteedOfTheSteppes extends DrawCard {
    static id = 'steed-of-the-steppes';

    setupCardAbilities() {
        this.whileAttached({
            effect: addTrait('cavalry')
        });

        this.action('Ready attached character')
            .cost(captureParentCost())
            .cost(costs.sacrificeSelf())
            .condition((context) => !!(context.player.opponent && context.player.getNumberOfOpponentsFaceupProvinces() >= 3))
            //need to put both as a target, context.source.parentCharacter is for the pre-cost checks, context.costs.captureParentCost is for the actual stand

            .ready((context) => ({ target: [context.source.parentCharacter, context.costs.captureParentCost].filter((card) => !!card) }));
    }
}


export default SteedOfTheSteppes;
