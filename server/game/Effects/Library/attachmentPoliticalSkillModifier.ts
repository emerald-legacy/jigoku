import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import { EffectName } from '../../Constants.js';
import { EffectBuilder } from '../EffectBuilder.js';

export type AttachmentPoliticalSkillModifierValue = number | ((card: BaseCard, context: AbilityContext) => number);

export function attachmentPoliticalSkillModifier(value: AttachmentPoliticalSkillModifierValue) {
    return EffectBuilder.card.flexible(EffectName.AttachmentPoliticalSkillModifier, value);
}
