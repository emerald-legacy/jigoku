import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { modifyMilitarySkill, modifyPoliticalSkill } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, EffectName, Players, Trait } from '../../../Constants.js';
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

// The modifiers report switched values (Traveling Tinkerer); this is how far the military total is off from the printed one.
function militarySwitchOffset(target: DrawCard): number {
    return target.attachments.reduce((offset, attachment) => {
        const military = parseInt(attachment.cardData.military_bonus ?? '');
        const political = parseInt(attachment.cardData.political_bonus ?? '');
        if(isNaN(military) || isNaN(political) || !attachment.isAttachmentBonusModifierSwitchActive()) {
            return offset;
        }
        return offset + military - political;
    }, 0);
}

function printedModifiers(target: DrawCard, context: AbilityContext) {
    const offset = militarySwitchOffset(target);
    return {
        military: sumModifiers(target.getEffects(EffectName.AttachmentMilitarySkillModifier), target, context) + offset,
        political: sumModifiers(target.getEffects(EffectName.AttachmentPoliticalSkillModifier), target, context) - offset
    };
}

export default class MirumotoRei extends DrawCard {
    static id = 'mirumoto-rei';

    override setupCardAbilities() {
        this.conflictAction('Give a skill bonus based on attachments')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.hasTrait(Trait.Bushi) && card !== context.source
            }, cardLastingEffect((context) => {
                const { military, political } = context.target ? printedModifiers(context.target, context) : { military: 0, political: 0 };
                return {
                    target: context.source,
                    effect: [modifyMilitarySkill(military), modifyPoliticalSkill(political)]
                };
            }))
            .chatText((context) => {
                const { military, political } = printedModifiers(context.target, context);
                return msg`give ${context.source} a skill bonus equal to the total attachment skill bonus on ${context.chatTarget()} (${military}${'military'}/${political}${'political'})`;
            });
    }
}
