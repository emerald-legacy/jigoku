import type BaseCard from '../../BaseCard.js';
import { EffectName } from '../../Constants.js';
import { EffectBuilder, type FlexibleValue } from '../EffectBuilder.js';

export type AttachmentPoliticalSkillModifierValue = FlexibleValue<number, BaseCard>;

export function attachmentPoliticalSkillModifier(value: AttachmentPoliticalSkillModifierValue) {
    return EffectBuilder.card.flexible(EffectName.AttachmentPoliticalSkillModifier, value);
}
