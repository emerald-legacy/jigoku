import type AbilityDsl from '../../abilitydsl.js';
import type Ring from '../../Ring.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { TargetMode } from '../../Constants.js';

class BeingAndBecoming extends DrawCard {
    static id = 'being-and-becoming';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            myControl: true
        });

        this.action({
            title: 'Move each fate from an unclaimed ring to attached character',
            cost: ability.costs.bowParent(),
            target: {
                mode: TargetMode.Ring,
                activePromptTitle: 'Choose an unclaimed ring to move fate from',
                ringCondition: (ring: any) => ring.isUnclaimed() && ring.fate > 0,
                gameAction: ability.actions.placeFate((context: AbilityContext) => ({
                    origin: context.ring,
                    amount: (context.ring as Ring).fate,
                    target: context.source.parent
                }))
            },
            effect: 'move {1} fate from {2} to {3}',
            effectArgs: context => [context.ring ? context.ring.fate : 0, context.ring, context.source.parent] as any
        });
    }
}


export default BeingAndBecoming;
