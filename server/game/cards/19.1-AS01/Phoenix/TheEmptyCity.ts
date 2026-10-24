import { msg } from '../../../GameChat.js';
import { CardType, ConflictType, Duration, Location, Players, Trait } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import * as costs from '../../../costs/index.js';
import { perRound } from '../../../AbilityLimit.js';
import { removeFromGameInsteadOfLeavingPlay } from '../../../effects.js';
import { claimRing, putIntoPlay } from '../../../GameActions/GameActions.js';

export default class TheEmptyCity extends ProvinceCard {
    static id = 'the-empty-city';

    public override setupCardAbilities() {
        const sharedLimit = perRound(1);

        this.action('Claim a ring')
            .canTriggerOutsideConflict()
            .cost(costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait(Trait.Spirit)
            }))
            .ringTarget({
                activePromptTitle: 'Choose an unclaimed ring',
                ringCondition: (ring) => ring.isUnclaimed()
            }, claimRing({
                takeFate: false,
                conflictType: ConflictType.Political
            }))
            .chatText('claim {0} as a political ring')
            .limit(sharedLimit);

        this.action('Put a Spirit character into play')
            .canTriggerOutsideConflict()
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                location: [Location.ConflictDiscardPile, Location.DynastyDiscardPile],
                cardCondition: (card) => card.hasTrait(Trait.Spirit) && card.costAtMost(3)
            }, putIntoPlay())
            .chatText('put {0} into play')
            .limit(sharedLimit)
            .afterwardsIf((context) => context.target.location === Location.PlayArea)
            .cardLastingEffect((context) => ({
                target: context.target,
                duration: Duration.UntilEndOfRound,
                effect: removeFromGameInsteadOfLeavingPlay({
                    message: (card) => msg`${card} is removed from the game, as it was invoked by the ${context.source} this round`
                })
            }));
    }
}
