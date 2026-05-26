import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class DarknessRising extends DrawCard {
    static id = 'darkness-rising';

    setupCardAbilities() {
        this.action({
            title: 'Bow weaker military characters',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.dishonor({ cardCondition: (card: any, context: any) => card.isParticipating() && this.getLegalTargetsForCard(card, context).length > 0 }),
            cannotTargetFirst: true,
            gameAction: AbilityDsl.actions.bow((context: any) => ({
                target: this.getLegalTargetsForCard(context.costs.dishonor, context)
            }))
        });
    }

    isTemptationsMaho() {
        return true;
    }

    getLegalTargetsForCard(card: any, context: any) {
        let targets = context.game.currentConflict.getParticipants().filter((c: any) => !card || (c.getMilitarySkill() < card.getMilitarySkill() && c.allowGameAction('bow', context)));
        return targets;
    }
}


export default DarknessRising;
