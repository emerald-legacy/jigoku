import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';

const ayubunePilotCaptureParentCost = function() {
    return {
        action: { name: 'ayubunePilotCaptureParentCost', getCostMessage: () => '' },
        canPay: function() {
            return true;
        },
        resolve: function(context: AbilityContext) {
            context.costs.ayubunePilotCaptureParentCost = context.source.parent;
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

        this.action({
            title: 'Move attached character into the conflict',
            cost: [
                ayubunePilotCaptureParentCost(),
                AbilityDsl.costs.sacrificeSelf()
            ],
            condition: context => !!(context.source.parent && !context.source.parent.bowed),
            gameAction: AbilityDsl.actions.moveToConflict(context => ({ target: [context.source.parent, context.costs.ayubunePilotCaptureParentCost] }))
        });
    }
}


export default AyubunePilot;


