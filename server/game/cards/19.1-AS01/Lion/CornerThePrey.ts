import type { AbilityContext } from '../../../AbilityContext.js';
import * as costs from '../../../costs/index.js';
import { discardFromPlay } from '../../../GameActions/GameActions.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, ConflictType, TargetMode, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class CornerThePrey extends DrawCard {
    static id = 'corner-the-prey';

    public override setupCardAbilities() {
        this.conflictAction('Sacrifice followers to kill', { conflictType: ConflictType.Military })
            .cost(costs.sacrifice({
                cardType: [CardType.Character, CardType.Attachment],
                mode: TargetMode.Unlimited,
                // A follower can be attached to a province, which does not participate.
                cardCondition: (card) =>
                    card.hasTrait(Trait.Follower) &&
                    (card.isParticipating() || !!card.parentCharacter?.isParticipating())
            }))
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.costAtMost(this.getFollowerCount(context, context.costs.sacrifice))
            }, discardFromPlay())
            .cannotTargetFirst()
            .cannotBeMirrored();
    }

    private getFollowerCount(context: AbilityContext, sacrificed: BaseCard | BaseCard[] | undefined): number {
        if(sacrificed) {
            return Array.isArray(sacrificed) ? sacrificed.length : 1;
        }
        const myFollowers = context.game.allCards.filter(
            (card) => card.controller === context.player && card.hasTrait(Trait.Follower)
        );
        return myFollowers.filter(
            (card) => card.isDrawCard() &&
                (card.isParticipating() || !!card.parentCharacter?.isParticipating())
        ).length;
    }
}
