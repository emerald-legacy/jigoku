import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { TargetModes } from '../../Constants.js';

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
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose an unclaimed ring to move fate from',
                ringCondition: (ring: any) => ring.isUnclaimed() && ring.fate > 0,
                gameAction: ability.actions.placeFate((context: any) => ({
                    origin: context.ring,
                    amount: context.ring.fate,
                    target: context.source.parent
                }))
            },
            effect: 'move {1} fate from {2} to {3}',
            // @ts-expect-error effectArgs returns mixed types but EffectArg union doesn't include Ring - game engine handles it
            effectArgs: context => [context.ring ? context.ring.fate : 0, context.ring, context.source.parent]
        });
    }
}


export default BeingAndBecoming;
