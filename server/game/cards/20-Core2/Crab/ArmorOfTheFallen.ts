import { AbilityContext } from '../../../AbilityContext.js';
import { AbilityType, CardType, Location, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';

export default class ArmorOfTheFallen extends DrawCard {
    static id = 'armor-of-the-fallen';

    public setupCardAbilities() {
        this.attachmentConditions({ trait: 'bushi' });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Remove characters from your discard pile to bow a character',
                condition: (context: AbilityContext) => context.source.isParticipating(),
                cost: AbilityDsl.costs.removeFromGame({
                    cardType: CardType.Character,
                    location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                    mode: TargetMode.Unlimited
                }),
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card: DrawCard, context: AbilityContext) =>
                        card.isParticipating() && (card.printedCost ?? 0) <= this.#maxCostReachable(context),
                    gameAction: AbilityDsl.actions.bow()
                },
                cannotTargetFirst: true
            })
        });
    }

    #maxCostReachable(context: AbilityContext) {
        if(context.costs.removeFromGame) {
            return (context.costs.removeFromGame as BaseCard[]).length;
        }

        const dynasty = this.#sumCharactersInPile(context.player.dynastyDiscardPile);
        const conflict = this.#sumCharactersInPile(context.player.conflictDiscardPile);
        return dynasty + conflict;
    }

    #sumCharactersInPile(pile: DrawCard[]): number {
        return pile.reduce((sum: number, card: DrawCard) => (card.type === CardType.Character ? sum + 1 : sum), 0);
    }
}
