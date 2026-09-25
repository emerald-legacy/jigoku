import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class BeingAndBecoming extends DrawCard {
    static id = 'being-and-becoming';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Move each fate from an unclaimed ring to attached character')
            .cost(ability.costs.bowParent())
            .ringTarget('target', {
                activePromptTitle: 'Choose an unclaimed ring to move fate from',
                ringCondition: (ring) => ring.isUnclaimed() && ring.fate > 0
            }, ability.actions.placeFate((context) => ({
                origin: context.ring,
                amount: (context.ring).fate,
                target: context.source.parentCharacter ?? []
            })))
            .effect('move {1} fate from {2} to {3}', context => [context.ring ? context.ring.fate : 0, context.ring, context.source.parentCharacter]);
    }
}


export default BeingAndBecoming;
