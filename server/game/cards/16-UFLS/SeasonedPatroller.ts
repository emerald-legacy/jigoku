import DrawCard from '../../DrawCard.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, Location } from '../../Constants.js';

class SeasonedPatroller extends DrawCard {
    static id = 'seasoned-patroller';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card: ProvinceCard) => card.isConflictProvince(),
            targetLocation: Location.Provinces,
            targetController: Players.Any,
            condition: context => context.source.isAttacking(),
            effect: [
                AbilityDsl.effects.suppressEffects((effect) =>
                    effect.isProvinceStrengthModifier() && (effect.getValue() ?? 0) > 0
                ),
                AbilityDsl.effects.provinceCannotHaveSkillIncreased(),
                AbilityDsl.effects.cannotApplyLastingEffects((effect) =>
                    effect.isProvinceStrengthModifier() && (effect.getValue() ?? 0) > 0
                )
            ]
        });
    }
}


export default SeasonedPatroller;
