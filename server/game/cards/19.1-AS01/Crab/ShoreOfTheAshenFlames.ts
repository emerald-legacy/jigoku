import { CardType, EffectName } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { conflictSkillExclusion } from '../../../effects.js';
import { isEffectOf, isEffectOfAny } from '../../../Effects/types.js';
import type { EffectApplier } from '../../../Effects/EffectApplier.js';
import type DrawCard from '../../../DrawCard.js';

export default class ShoreOfTheAshenFlames extends ProvinceCard {
    static id = 'shore-of-the-ashen-flames';

    override setupCardAbilities() {
        // "attacking characters": the cards on the attacking side, whoever controls them. Only the skill the conflict
        // counts changes, so the conflict's own skill function (Sanpuku Seido, Massing at Twilight) still applies.
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            effect: conflictSkillExclusion({
                match: (card) => card.isAttacking(),
                excludes: (effect, card) => this.isAttachmentSkillIncrease(effect, card)
            })
        });
    }

    private isAttachmentSkillIncrease(effect: EffectApplier, card: DrawCard): boolean {
        if(isEffectOf(effect, EffectName.AttachmentMilitarySkillModifier) || isEffectOf(effect, EffectName.AttachmentPoliticalSkillModifier)) {
            return effect.getValue(card) > 0;
        }
        if(isEffectOfAny(effect, [EffectName.ModifyMilitarySkill, EffectName.ModifyPoliticalSkill, EffectName.ModifyBothSkills])) {
            // only increases are blocked; a penalty from an attachment still applies
            return effect.context?.source?.type === CardType.Attachment && (effect.getValue(card) ?? 0) > 0;
        }
        return false;
    }
}
