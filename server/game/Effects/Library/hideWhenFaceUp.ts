import { EffectName } from '../../Constants.js';
import { EffectBuilder } from '../EffectBuilder.js';

export function hideWhenFaceUp() {
    return EffectBuilder.card.static(EffectName.HideWhenFaceUp, true);
}
