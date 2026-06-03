import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import { EffectName } from '../../Constants.js';
import { EffectBuilder } from '../EffectBuilder.js';

export type AttachmentMilitarySkillModifierValue = number | ((card: BaseCard, context: AbilityContext) => number);

export function attachmentMilitarySkillModifier(value: AttachmentMilitarySkillModifierValue) {
    return EffectBuilder.card.flexible(EffectName.AttachmentMilitarySkillModifier, value);
}
