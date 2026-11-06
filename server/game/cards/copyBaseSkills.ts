import { setBaseDash, setBaseMilitarySkill, setBasePoliticalSkill, setMilitarySkill, setPoliticalSkill } from '../effects.js';
import type DrawCard from '../DrawCard.js';
import { SkillType } from '../Constants.js';

/**
 * Effects that set a character's base `skills` to `card`'s current (or `base`) skills, keeping a dash as a dash.
 * `overrideModifiers` also sets the current skills, so later non-set modifiers don't apply (ruling #388).
 */
export function copyBaseSkillEffects(card: DrawCard, { base = false, skills = [SkillType.Military, SkillType.Political], overrideModifiers = false }:
    { base?: boolean; skills?: SkillType[]; overrideModifiers?: boolean } = {}) {
    return skills.flatMap((type) => {
        if(card.hasDash(type)) {
            return [setBaseDash(type)];
        }
        if(type === SkillType.Military) {
            const value = base ? card.getBaseMilitarySkill() : card.militarySkill;
            return overrideModifiers ? [setBaseMilitarySkill(value), setMilitarySkill(value)] : [setBaseMilitarySkill(value)];
        }
        const value = base ? card.getBasePoliticalSkill() : card.politicalSkill;
        return overrideModifiers ? [setBasePoliticalSkill(value), setPoliticalSkill(value)] : [setBasePoliticalSkill(value)];
    });
}
