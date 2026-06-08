import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import type { Cost } from '../../costs/Cost.js';

const steedOfTheSteppesCaptureParentCost = function(): Cost {
    return {
        canPay: function() {
            return true;
        },
        resolve: function(context: AbilityContext) {
            context.costs.steedOfTheSteppesCaptureParentCost = (context.source as DrawCard).parent;
        },
        pay: function() {
        }
    };
};

class SteedOfTheSteppes extends DrawCard {
    static id = 'steed-of-the-steppes';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.addTrait('cavalry')
        });

        this.action({
            title: 'Ready attached character',
            condition: context => !!(context.player.opponent && context.player.getNumberOfOpponentsFaceupProvinces() >= 3),
            cost: [
                steedOfTheSteppesCaptureParentCost(),
                AbilityDsl.costs.sacrificeSelf()
            ],
            //need to put both as a target, context.source.parent is for the pre-cost checks, context.costs.steedOfTheSteppesCaptureParentCost is for the actual stand
            //I don't like it, but it isnn't work otherwise
            gameAction: AbilityDsl.actions.ready(context => ({ target: [context.source.parent, context.costs.steedOfTheSteppesCaptureParentCost] }))
        });
    }
}


export default SteedOfTheSteppes;
