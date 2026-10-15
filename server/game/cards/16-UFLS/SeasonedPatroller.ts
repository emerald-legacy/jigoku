import DrawCard from '../../DrawCard.js';
import { cannotApplyLastingEffects, provinceCannotHaveSkillIncreased, suppressEffects } from '../../effects.js';
import { Players, Location } from '../../Constants.js';

class SeasonedPatroller extends DrawCard {
    static id = 'seasoned-patroller';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card) => card.isConflictProvince(),
            targetLocation: Location.Provinces,
            targetController: Players.Any,
            condition: (context) => context.source.isAttacking(),
            effect: [
                suppressEffects((effect) =>
                    effect.isProvinceStrengthModifier() && (effect.getValue() ?? 0) > 0
                ),
                provinceCannotHaveSkillIncreased(),
                cannotApplyLastingEffects((effect) =>
                    effect.isProvinceStrengthModifier() && (effect.getValue() ?? 0) > 0
                )
            ]
        });
    }
}


export default SeasonedPatroller;
