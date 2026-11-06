import type BaseCard from '../../BaseCard.js';
import { EffectName } from '../../Constants.js';
import { EffectBuilder, type FlexibleValue } from '../EffectBuilder.js';

export type AttachmentMilitarySkillModifierValue = FlexibleValue<number, BaseCard>;

export function attachmentMilitarySkillModifier(value: AttachmentMilitarySkillModifierValue) {
    return EffectBuilder.card.flexible(EffectName.AttachmentMilitarySkillModifier, value);
}
