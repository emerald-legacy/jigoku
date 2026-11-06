import { EffectName } from '../../Constants.js';
import type { ConflictTypeOrBoth } from '../EffectValueMap.js';
import { EffectBuilder } from '../EffectBuilder.js';

export function mustBeDeclaredAsAttacker(type: ConflictTypeOrBoth = 'both') {
    return EffectBuilder.card.static(EffectName.MustBeDeclaredAsAttacker, type);
}
