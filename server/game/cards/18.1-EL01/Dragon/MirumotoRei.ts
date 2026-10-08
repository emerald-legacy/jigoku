import type { AbilityContext } from '../../../AbilityContext.js';
import { modifyMilitarySkill, modifyPoliticalSkill } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, EffectName, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { AttachmentMilitarySkillModifierValue } from '../../../Effects/Library/attachmentMilitarySkillModifier.js';
import type { AttachmentPoliticalSkillModifierValue } from '../../../Effects/Library/attachmentPoliticalSkillModifier.js';

function sumModifiers(
    modifiers: Array<AttachmentMilitarySkillModifierValue> | Array<AttachmentPoliticalSkillModifierValue>,
    target: DrawCard,
    context: AbilityContext
): number {
    return modifiers.reduce<number>((a, b) => a + (typeof b === 'number' ? b : b(target, context)), 0);
}

export default class MirumotoRei extends DrawCard {
    static id = 'mirumoto-rei';

    setupCardAbilities() {
        this.conflictAction('Give a skill bonus based on attachments')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.hasTrait('bushi') && card !== context.source
            }, cardLastingEffect((context) => ({
                target: context.source,
                effect: [
                    modifyMilitarySkill(
                        context.target
                            ? sumModifiers(
                                context.target.getEffects(EffectName.AttachmentMilitarySkillModifier),
                                context.target,
                                context
                            )
                            : 0
                    ),
                    modifyPoliticalSkill(
                        context.target
                            ? sumModifiers(
                                context.target.getEffects(EffectName.AttachmentPoliticalSkillModifier),
                                context.target,
                                context
                            )
                            : 0
                    )
                ]
            })))
            .chatText('give {1} a skill bonus equal to the total attachment skill bonus on {0} ({2}{3}/{4}{5})', (context) => {
                const target = context.target;
                return [
                    context.source,
                    sumModifiers(
                        target.getEffects(EffectName.AttachmentMilitarySkillModifier),
                        target,
                        context
                    ),
                    'military',
                    sumModifiers(
                        target.getEffects(EffectName.AttachmentPoliticalSkillModifier),
                        target,
                        context
                    ),
                    'political'
                ];
            });
    }
}
