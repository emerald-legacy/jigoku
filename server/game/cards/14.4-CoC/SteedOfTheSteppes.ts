import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { addTrait } from '../../effects.js';
import { captureParentCost, capturedParent } from '../captureParentCost.js';

class SteedOfTheSteppes extends DrawCard {
    static id = 'steed-of-the-steppes';

    override setupCardAbilities() {
        this.whileAttached({
            effect: addTrait(Trait.Cavalry)
        });

        this.action('Ready attached character')
            .ifCondition((context) => !!(context.player.opponent && context.player.getNumberOfOpponentsFaceupProvinces() >= 3))
            .cost(captureParentCost())
            .cost(costs.sacrificeSelf())
            .ready((context) => ({ target: capturedParent(context) ?? [] }));
    }
}


export default SteedOfTheSteppes;
