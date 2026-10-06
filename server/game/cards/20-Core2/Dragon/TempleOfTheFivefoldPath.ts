import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { placeFateOnRing } from '../../../GameActions/GameActions.js';

export default class TempleOfTheFivefoldPath extends StrongholdCard {
    static id = 'temple-of-the-fivefold-path';

    setupCardAbilities() {
        const sharedLimit = AbilityDsl.limit.perRound(1);

        this.action('Place fate on a ring without fate')
            .cost(AbilityDsl.costs.bowSelf())
            .ringTarget({ ringCondition: (ring) => ring.getFate() === 0 }, placeFateOnRing())
            .limit(sharedLimit);

        this.action('Move 1 fate from one ring to another')
            .cost(AbilityDsl.costs.bowSelf())
            .ringTarget({
                name: 'donor',
                activePromptTitle: 'Choose a ring to lose fate',
                ringCondition: (ring) => ring.getFate() > 0
            })
            .ringTarget({
                name: 'receiver',
                activePromptTitle: 'Choose a ring to gain fate',
                ringCondition: (ring, context) => ring !== context.rings.donor
            }, placeFateOnRing((context) => ({
                origin: context.rings.donor
            })))
            .limit(sharedLimit);
    }
}
