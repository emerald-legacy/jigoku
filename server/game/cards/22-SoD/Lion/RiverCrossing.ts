import { Duration, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

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
                duration: Duration.UntilEndOfConflict,
                targetController: Players.Any,
                effect: AbilityDsl.effects.changeConflictSkillFunction((_card: DrawCard) => 1)
            })
        });
    }
}
