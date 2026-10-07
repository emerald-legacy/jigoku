import type { AbilityContext } from '../../../AbilityContext.js';
import { AbilityType, CardType, Location, TargetMode } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { gainAbility } from '../../../effects.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ArmorOfTheFallen extends DrawCard {
    static id = 'armor-of-the-fallen';

    public setupCardAbilities() {
        this.attachmentConditions({ trait: 'bushi' });

        this.whileAttached({
            effect: gainAbility(AbilityType.Action, {
                title: 'Remove characters from your discard pile to bow a character',
                condition: (context) => context.source.isParticipating(),
                cost: costs.removeFromGame({
                    cardType: CardType.Character,
                    location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                    mode: TargetMode.Unlimited
                }),
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card, context) =>
                        card.isParticipating() && (card.printedCost ?? 0) <= this.maxCostReachable(context),
                    gameAction: bow()
                },
                cannotTargetFirst: true
            })
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
