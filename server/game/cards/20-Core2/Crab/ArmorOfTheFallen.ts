import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Location, TargetMode, Trait } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { gainAbility } from '../../../effects.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ArmorOfTheFallen extends DrawCard {
    static id = 'armor-of-the-fallen';

    public override setupCardAbilities() {
        this.attachmentConditions({ trait: Trait.Bushi });

        this.whileAttached({
            effect: gainAbility.conflictAction('Remove characters from your discard pile to bow a character', (ability) => ability
                .cost(costs.removeFromGame({
                    cardType: CardType.Character,
                    location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                    mode: TargetMode.Unlimited
                }))
                .target({
                    cardType: CardType.Character,
                    cardCondition: (card, context) =>
                        card.isParticipating() && (card.printedCost ?? 0) <= this.maxCostReachable(context)
                }, bow())
                .cannotTargetFirst())
        });
    }

    private maxCostReachable(context: AbilityContext) {
        const removed = context.costs.removeFromGame;
        if(removed) {
            // the cost is paid before targeting, so it holds every card removed
            return Array.isArray(removed) ? removed.length : 1;
        }

        const dynasty = this.sumCharactersInPile(context.player.dynastyDiscardPile);
        const conflict = this.sumCharactersInPile(context.player.conflictDiscardPile);
        return dynasty + conflict;
    }

    private sumCharactersInPile(pile: DrawCard[]): number {
        return pile.reduce((sum, card) => (card.type === CardType.Character ? sum + 1 : sum), 0);
    }
}
