import DrawCard from '../../DrawCard.js';
import { EffectName, Location, Players } from '../../Constants.js';
import { cannotApplyLastingEffects, provinceCannotHaveSkillIncreased, suppressEffects } from '../../effects.js';
import type { EffectApplier } from '../../Effects/EffectApplier.js';
import { isEffectOf } from '../../Effects/types.js';
import type { GameObject } from '../../GameObject.js';

class SeasonedPatroller extends DrawCard {
    static id = 'seasoned-patroller';

    override setupCardAbilities() {
        this.persistentEffect({
            match: (card) => card.isConflictProvince(),
            targetLocation: Location.Provinces,
            targetController: Players.Any,
            condition: (context) => context.source.isAttacking(),
            effect: [
                suppressEffects((effect) => this.increasesStrength(effect)),
                provinceCannotHaveSkillIncreased(),
                cannotApplyLastingEffects((effect) => this.increasesStrength(effect))
            ]
        });
    }

    // a set strength is not an increase; a calculated one has its value per province
    private increasesStrength(effect: EffectApplier<EffectName, GameObject, unknown>): boolean {
        const provinces = this.game.currentConflict?.getConflictProvinces() ?? [];
        if(isEffectOf(effect, EffectName.ModifyProvinceStrength)) {
            return provinces.some((province) => (effect.getValue(province) ?? 0) > 0);
        }
        if(isEffectOf(effect, EffectName.ModifyProvinceStrengthMultiplier)) {
            return provinces.some((province) => (effect.getValue(province) ?? 1) > 1);
        }
        return false;
    }
}


export default SeasonedPatroller;
