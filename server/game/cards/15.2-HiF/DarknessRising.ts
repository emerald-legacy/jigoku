import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { Conflict } from '../../Conflict.js';
import AbilityDsl from '../../abilitydsl.js';

class DarknessRising extends DrawCard {
    static id = 'darkness-rising';

    setupCardAbilities() {
        this.action({
            title: 'Bow weaker military characters',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.dishonor({ cardCondition: (card: DrawCard, context: AbilityContext) => card.isParticipating() && this.getLegalTargetsForCard(card, context).length > 0 }),
            cannotTargetFirst: true,
            gameAction: AbilityDsl.actions.bow((context: AbilityContext) => ({
                target: this.getLegalTargetsForCard(context.costs.dishonor as DrawCard, context)
            }))
        });
    }

    isTemptationsMaho() {
        return true;
    }

    getLegalTargetsForCard(card: DrawCard, context: AbilityContext) {
        let targets = (context.game.currentConflict as Conflict).getParticipants().filter((c: DrawCard) => !card || (c.getMilitarySkill() < card.getMilitarySkill() && c.allowGameAction('bow', context)));
        return targets;
    }
}


export default DarknessRising;
