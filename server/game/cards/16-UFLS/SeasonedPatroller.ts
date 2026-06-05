import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, Location } from '../../Constants.js';
import type StaticEffect from '../../Effects/StaticEffect.js';

class SeasonedPatroller extends DrawCard {
    static id = 'seasoned-patroller';

    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.isConflictProvince(),
            targetLocation: Location.Provinces,
            targetController: Players.Any,
            condition: context => context.source.isAttacking(),
            effect: [
                AbilityDsl.effects.suppressEffects((effect: unknown) =>
                    (effect as StaticEffect).isProvinceStrengthModifier() && (effect as StaticEffect).getValue<number>() > 0
                ),
                AbilityDsl.effects.provinceCannotHaveSkillIncreased(),
                AbilityDsl.effects.cannotApplyLastingEffects((effect: StaticEffect) =>
                    effect.isProvinceStrengthModifier() && effect.getValue<number>() > 0
                )
            ]
        });
    }
}


export default SeasonedPatroller;
