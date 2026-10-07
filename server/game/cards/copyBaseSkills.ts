import { setBaseDash, setBaseMilitarySkill, setBasePoliticalSkill } from '../effects.js';
import type DrawCard from '../DrawCard.js';
import { SkillType } from '../Constants.js';

/** Effects that set a character's base `skills` to `card`'s current (or `base`) skills, keeping a dash as a dash. */
export function copyBaseSkillEffects(card: DrawCard, { base = false, skills = [SkillType.Military, SkillType.Political] }: { base?: boolean; skills?: SkillType[] } = {}) {
    return skills.map((type) => {
        if(card.hasDash(type)) {
            return setBaseDash(type);
        }
        if(type === 'military') {
            return setBaseMilitarySkill(base ? card.getBaseMilitarySkill() : card.militarySkill);
        }
        return setBasePoliticalSkill(base ? card.getBasePoliticalSkill() : card.politicalSkill);
    });
}
