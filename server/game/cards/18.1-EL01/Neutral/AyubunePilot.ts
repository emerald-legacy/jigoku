import DrawCard from '../../../DrawCard.js';
import * as costs from '../../../costs/index.js';
import { captureParentCost } from '../../captureParentCost.js';

class AyubunePilot extends DrawCard {
    static id = 'ayubune-pilot';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Move attached character into the conflict')
            .cost(captureParentCost())
            .cost(costs.sacrificeSelf())
            .condition(context => !!(context.source.parentCharacter && !context.source.parentCharacter.bowed))
            .moveToConflict(context => ({ target: [context.source.parentCharacter, context.costs.captureParentCost].filter((card) => !!card) }));
    }
}


export default AyubunePilot;
