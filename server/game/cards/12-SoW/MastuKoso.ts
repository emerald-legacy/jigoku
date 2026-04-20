import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { Durations } from '../../Constants';

class MatsuKoso extends DrawCard {
    static id = 'matsu-koso';

    setupCardAbilities() {
        this.action({
            title: 'Lower military skill',
            condition: (context) => context.source.isParticipating(),
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.game.currentConflict.getParticipants(),
                duration: Durations.UntilEndOfConflict,
                effect: AbilityDsl.effects.modifyMilitarySkill((card) =>
                    isNaN(card.printedPoliticalSkill) ? 0 : -card.printedPoliticalSkill
                )
            })),
            effect: 'lower the military skill of {1} by their respective printed political skill',
            effectArgs: (context) => [context.game.currentConflict.getParticipants()]
        });
    }
}


export default MatsuKoso;
