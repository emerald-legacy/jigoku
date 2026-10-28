import { EffectName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';

const setSkillEffects = [EffectName.SetMilitarySkill, EffectName.SetPoliticalSkill, EffectName.SetBaseMilitarySkill, EffectName.SetBasePoliticalSkill];

/** Whether a character's military and political skills can be switched: not a dash (RRG Dash) and not set by an effect (ruling #413). */
export function canSwitchSkills(card: DrawCard): boolean {
    return !card.hasDash() && !setSkillEffects.some((effect) => card.anyEffect(effect));
}
