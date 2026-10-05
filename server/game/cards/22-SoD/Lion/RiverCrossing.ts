import { Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class RiverCrossing extends ProvinceCard {
    static id = 'river-crossing';

    setupCardAbilities() {
        this.reaction('Make characters count 1 skill')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .gameAction(AbilityDsl.actions.playerLastingEffect({
                targetController: Players.Any,
                effect: AbilityDsl.effects.changeConflictSkillFunction((_card) => 1)
            }))
            .effect('make it so each character contributes 1 skill to the conflict');
    }
}
