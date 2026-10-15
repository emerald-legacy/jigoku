import { msg } from '../../../GameChat.js';
import { cannotTriggerAbilities } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ShinjoScout2 extends DrawCard {
    static id = 'shinjo-scout-2';

    setupCardAbilities() {
        this.interrupt('Cancel the province effect')
            .when({
                onCardRevealed: (event, context) =>
                    event.card.isProvinceCard() && event.card.isConflictProvince() && context.source.isAttacking()
            })
            .selectAttackedProvince({
                cardCondition: (card, context) => card === context.event.card,
                message: (context, province) => msg`${context.player} prevents ${province} from triggering its abilities during this conflict`,
                gameAction: cardLastingEffect({
                    effect: cannotTriggerAbilities()
                })
            })
            .chatText('avoid the dangers of their exploration');
    }
}
