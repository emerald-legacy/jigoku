import DrawCard from '../../../DrawCard.js';
import * as costs from '../../../costs/index.js';
import { captureParentCost } from '../../captureParentCost.js';

class AyubunePilot extends DrawCard {
    static id = 'ayubune-pilot';

    override setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.conflictAction('Move attached character into the conflict', { evenFromHome: true })
            .condition((context) => !!(context.source.parentCharacter && !context.source.parentCharacter.bowed))
            .cost(captureParentCost())
            .cost(costs.sacrificeSelf())
            .moveToConflict((context) => ({ target: [context.source.parentCharacter, context.costs.captureParentCost].filter((card) => !!card) }));
    }
}


export default AyubunePilot;
