import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import type { Cost } from '../../../costs/Cost.js';

const ayubunePilotCaptureParentCost = function(): Cost<{ ayubunePilotCaptureParentCost: DrawCard | null }> {
    return {
        canPay: function() {
            return true;
        },
        resolve: function(context) {
            context.costs.ayubunePilotCaptureParentCost = context.source.parentCharacter;
        },
        pay: function() {
        }
    };
};


class AyubunePilot extends DrawCard {
    static id = 'ayubune-pilot';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Move attached character into the conflict')
            .cost(ayubunePilotCaptureParentCost())
            .cost(AbilityDsl.costs.sacrificeSelf())
            .condition(context => !!(context.source.parentCharacter && !context.source.parentCharacter.bowed))
            .gameAction(AbilityDsl.actions.moveToConflict(context => ({ target: [context.source.parentCharacter, context.costs.ayubunePilotCaptureParentCost as DrawCard].filter((card) => card !== null) })));
    }
}


export default AyubunePilot;


