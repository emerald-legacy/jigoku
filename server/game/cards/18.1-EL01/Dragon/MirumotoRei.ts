import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Durations, EffectNames, Players } from '../../../Constants.js';
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
        this.action<DrawCard>({
            title: 'Give a skill bonus based on attachments',

            condition: (context) => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.hasTrait('bushi') && card !== context.source,
                gameAction: AbilityDsl.actions.cardLastingEffect<DrawCard>((context) => ({
                    target: context.source,
                    effect: [
                        AbilityDsl.effects.modifyMilitarySkill(
                            context.target
                                ? sumModifiers(
                                    context.target.getEffects(EffectNames.AttachmentMilitarySkillModifier),
                                    context.target,
                                    context
                                )
                                : 0
                        ),
                        AbilityDsl.effects.modifyPoliticalSkill(
                            context.target
                                ? sumModifiers(
                                    context.target.getEffects(EffectNames.AttachmentPoliticalSkillModifier),
                                    context.target,
                                    context
                                )
                                : 0
                        )
                    ],
                    duration: Durations.UntilEndOfConflict
                }))
            },
            effect: 'give {1} a skill bonus equal to the total attachment skill bonus on {0} ({2}{3}/{4}{5})',
            effectArgs: (context) => {
                const target = context.target;
                if(!target) {
                    return [context.source, 0, 'military', 0, 'political'];
                }
                return [
                    context.source,
                    sumModifiers(
                        target.getEffects(EffectNames.AttachmentMilitarySkillModifier),
                        target,
                        context
                    ),
                    'military',
                    sumModifiers(
                        target.getEffects(EffectNames.AttachmentPoliticalSkillModifier),
                        target,
                        context
                    ),
                    'political'
                ];
            }
        });
    }
}
