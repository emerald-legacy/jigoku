import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { captureParentCost } from '../../captureParentCost.js';

class AyubunePilot extends DrawCard {
    static id = 'ayubune-pilot';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Move attached character into the conflict')
            .cost(captureParentCost())
            .cost(AbilityDsl.costs.sacrificeSelf())
            .condition(context => !!(context.source.parentCharacter && !context.source.parentCharacter.bowed))
            .gameAction(AbilityDsl.actions.moveToConflict(context => ({ target: [context.source.parentCharacter, context.costs.captureParentCost].filter((card) => !!card) })));
    }
}


export default AyubunePilot;
