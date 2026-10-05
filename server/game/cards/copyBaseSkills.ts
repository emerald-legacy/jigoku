import AbilityDsl from '../abilitydsl.js';
import type DrawCard from '../DrawCard.js';
import type { DashSkillType } from '../Effects/EffectValueMap.js';

/** Effects that set a character's base `skills` to `card`'s current (or `base`) skills, keeping a dash as a dash. */
export function copyBaseSkillEffects(card: DrawCard, { base = false, skills = ['military', 'political'] }: { base?: boolean; skills?: DashSkillType[] } = {}) {
    return skills.map((type) => {
        if(card.hasDash(type)) {
            return AbilityDsl.effects.setBaseDash(type);
        }
        if(type === 'military') {
            return AbilityDsl.effects.setBaseMilitarySkill(base ? card.getBaseMilitarySkill() : card.militarySkill);
        }
        return AbilityDsl.effects.setBasePoliticalSkill(base ? card.getBasePoliticalSkill() : card.politicalSkill);
    });
}
