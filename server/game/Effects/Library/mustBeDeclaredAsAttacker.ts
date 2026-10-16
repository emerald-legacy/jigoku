import { type ConflictType, EffectName } from '../../Constants.js';
import { EffectBuilder } from '../EffectBuilder.js';

export function mustBeDeclaredAsAttacker(type: ConflictType | 'both' = 'both') {
    return EffectBuilder.card.static(EffectName.MustBeDeclaredAsAttacker, type);
}
