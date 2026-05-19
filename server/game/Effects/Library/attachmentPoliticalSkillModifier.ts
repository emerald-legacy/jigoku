import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../basecard.js';
import { EffectNames } from '../../Constants.js';
import { EffectBuilder } from '../EffectBuilder.js';

export type AttachmentPoliticalSkillModifierValue = number | ((card: BaseCard, context: AbilityContext) => number);

export function attachmentPoliticalSkillModifier(value: AttachmentPoliticalSkillModifierValue) {
    return EffectBuilder.card.flexible(EffectNames.AttachmentPoliticalSkillModifier, value);
}
