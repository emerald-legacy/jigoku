import DrawCard from '../../../DrawCard.js';
import * as costs from '../../../costs/index.js';
import { captureParentCost, capturedParent } from '../../captureParentCost.js';

class AyubunePilot extends DrawCard {
    static id = 'ayubune-pilot';

    override setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.conflictAction('Move attached character into the conflict', { evenFromHome: true })
            .ifCondition((context) => !!(context.source.parentCharacter && !context.source.parentCharacter.bowed))
            .cost(captureParentCost())
            .cost(costs.sacrificeSelf())
            .moveToConflict((context) => ({ target: capturedParent(context) ?? [] }));
    }
}


export default AyubunePilot;
