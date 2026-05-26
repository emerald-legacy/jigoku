import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, Locations } from '../../Constants.js';

class SeasonedPatroller extends DrawCard {
    static id = 'seasoned-patroller';

    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.isConflictProvince(),
            targetLocation: Locations.Provinces,
            targetController: Players.Any,
            condition: context => context.source.isAttacking(),
            effect: [
                AbilityDsl.effects.suppressEffects((effect: any) =>
                    effect.isProvinceStrengthModifier() && effect.getValue() > 0
                ),
                AbilityDsl.effects.provinceCannotHaveSkillIncreased(),
                AbilityDsl.effects.cannotApplyLastingEffects((effect: any) =>
                    effect.isProvinceStrengthModifier() && effect.getValue() > 0
                )
            ]
        });
    }
}


export default SeasonedPatroller;
