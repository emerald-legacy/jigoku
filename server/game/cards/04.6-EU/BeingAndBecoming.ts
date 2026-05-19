import DrawCard from '../../drawcard.js';
import { TargetModes } from '../../Constants.js';

class BeingAndBecoming extends DrawCard {
    static id = 'being-and-becoming';

    setupCardAbilities(ability) {
        this.attachmentConditions({
            myControl: true
        });

        this.action({
            title: 'Move each fate from an unclaimed ring to attached character',
            cost: ability.costs.bowParent(),
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose an unclaimed ring to move fate from',
                ringCondition: ring => ring.isUnclaimed() && ring.fate > 0,
                gameAction: ability.actions.placeFate(context => ({
                    origin: context.ring,
                    amount: context.ring.fate,
                    target: context.source.parent
                }))
            },
            effect: 'move {1} fate from {2} to {3}',
            effectArgs: context => [context.ring.fate, context.ring, context.source.parent]
        });
    }
}


export default BeingAndBecoming;
