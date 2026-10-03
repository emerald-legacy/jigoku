import AbilityDsl from '../../../abilitydsl.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class TravelingTinkerer extends DrawCard {
    static id = 'traveling-tinkerer';

    setupCardAbilities() {
        this.action('Flip the modifiers of an attachment')
            .condition((context) => context.game.isDuringConflict())
            .target('target', {
                cardType: CardType.Attachment
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.switchAttachmentSkillModifiers()
            }))
            .effect('switch the skill modifiers of {0}');
    }
}
