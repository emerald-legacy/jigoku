import { EffectName } from '../../Constants.js';
import { EffectBuilder } from '../EffectBuilder.js';

export type MustBeDeclaredAsAttackerValue = 'both' | 'military' | 'political';

export function mustBeDeclaredAsAttacker(type: MustBeDeclaredAsAttackerValue = 'both') {
    return EffectBuilder.card.static(EffectName.MustBeDeclaredAsAttacker, type);
}
