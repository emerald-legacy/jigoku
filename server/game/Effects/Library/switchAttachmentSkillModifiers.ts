import { EffectName } from '../../Constants.js';
import { EffectBuilder } from '../EffectBuilder.js';

export function switchAttachmentSkillModifiers() {
    return EffectBuilder.card.flexible(EffectName.SwitchAttachmentSkillModifiers, true);
}
