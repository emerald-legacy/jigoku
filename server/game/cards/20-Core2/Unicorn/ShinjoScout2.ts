import { msg } from '../../../GameChat.js';
import { RestrictionScope, RestrictionType } from '../../../Constants.js';
import { cardCannot } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ShinjoScout2 extends DrawCard {
    static id = 'shinjo-scout-2';

    override setupCardAbilities() {
        this.interrupt('Cancel the province effect')
            .when({
                onCardRevealed: (event, context) =>
                    event.card.isProvinceCard() && event.card.isConflictProvince() && context.source.isAttacking()
            })
            .selectAttackedProvince({
                cardCondition: (card, context) => card === context.event.card,
                message: (context, province) => msg`${context.player} prevents ${province} from triggering its abilities during this conflict`,
                gameAction: cardLastingEffect({
                    effect: cardCannot({
                        cannot: RestrictionType.TriggerAbilities,
                        appliesTo: [RestrictionScope.OpponentsCardAbilities, RestrictionScope.NonForcedAbilities]
                    })
                })
            })
            .chatText('avoid the dangers of their exploration');
    }
}
