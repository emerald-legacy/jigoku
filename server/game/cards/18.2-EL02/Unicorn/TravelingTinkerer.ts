import { switchAttachmentSkillModifiers } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import type BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';

function printedBonus(value?: string | null): number {
    return parseInt(value ?? '') || 0;
}

export default class TravelingTinkerer extends DrawCard {
    static id = 'traveling-tinkerer';

    override setupCardAbilities() {
        this.conflictAction('Flip the modifiers of an attachment', { evenFromHome: true })
            .target({
                cardType: CardType.Attachment,
                cardCondition: (card) => this.switchChangesSkills(card)
            }, cardLastingEffect({
                effect: switchAttachmentSkillModifiers()
            }))
            .chatText('switch the skill modifiers of {0}');
    }

    private switchChangesSkills(attachment: BaseCard): boolean {
        return attachment.parent instanceof DrawCard && attachment.parent.type === CardType.Character &&
            printedBonus(attachment.cardData.military_bonus) !== printedBonus(attachment.cardData.political_bonus);
    }
}
