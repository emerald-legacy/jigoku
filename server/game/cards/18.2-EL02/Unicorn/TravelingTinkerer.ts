import { switchAttachmentSkillModifiers } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class TravelingTinkerer extends DrawCard {
    static id = 'traveling-tinkerer';

    setupCardAbilities() {
        this.conflictAction('Flip the modifiers of an attachment', { evenFromHome: true })
            .target({
                cardType: CardType.Attachment
            }, cardLastingEffect({
                effect: switchAttachmentSkillModifiers()
            }))
            .chatText('switch the skill modifiers of {0}');
    }
}
