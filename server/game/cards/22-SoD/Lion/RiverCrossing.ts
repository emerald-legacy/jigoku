import { Durations, Players } from '../../../Constants';
import { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';

export default class RiverCrossing extends ProvinceCard {
    static id = 'river-crossing';

    setupCardAbilities() {
        this.reaction({
            title: 'Search for an attachment',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            },
            effect: 'make it so each character contributes 1 skill to the conflict',
            gameAction: AbilityDsl.actions.playerLastingEffect({
                duration: Durations.UntilEndOfConflict,
                targetController: Players.Any,
                effect: AbilityDsl.effects.changeConflictSkillFunction(_card => 1)
            })
        });
    }
}
