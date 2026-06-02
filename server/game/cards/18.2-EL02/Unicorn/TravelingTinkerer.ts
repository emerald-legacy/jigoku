import AbilityDsl from '../../../abilitydsl.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class TravelingTinkerer extends DrawCard {
    static id = 'traveling-tinkerer';

    setupCardAbilities() {
        this.action({
            title: 'Flip the modifiers of an attachment',
            condition: (context) => context.game.isDuringConflict(),
            target: {
                cardType: CardType.Attachment,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.switchAttachmentSkillModifiers()
                })
            },
            effect: 'switch the skill modifiers of {0}'
        });
    }
}
