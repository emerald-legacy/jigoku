import { switchAttachmentSkillModifiers } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class TravelingTinkerer extends DrawCard {
    static id = 'traveling-tinkerer';

    setupCardAbilities() {
        this.action('Flip the modifiers of an attachment')
            .condition((context) => context.game.isDuringConflict())
            .target({
                cardType: CardType.Attachment
            }, cardLastingEffect({
                effect: switchAttachmentSkillModifiers()
            }))
            .effect('switch the skill modifiers of {0}');
    }
}
