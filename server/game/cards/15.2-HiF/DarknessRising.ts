import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class DarknessRising extends DrawCard {
    static id = 'darkness-rising';

    setupCardAbilities() {
        this.action('Bow weaker military characters')
            .cost(AbilityDsl.costs.dishonor({ cardType: CardType.Character, cardCondition: (card, context) => card.isParticipating() && this.getLegalTargetsForCard(card, context).length > 0 }))
            .condition(context => context.game.isDuringConflict())
            .bow((context) => ({
                target: this.getLegalTargetsForCard(context.costs.dishonor, context)
            }))
            .cannotTargetFirst();
    }

    isTemptationsMaho() {
        return true;
    }

    getLegalTargetsForCard(card: DrawCard | undefined, context: AbilityContext) {
        return context.game.requireConflict().getParticipants().filter((c) => !card || (c.getMilitarySkill() < card.getMilitarySkill() && c.allowGameAction('bow', context)));
    }
}


export default DarknessRising;
