import { msg } from '../../../GameChat.js';
import { CardType, Location } from '../../../Constants.js';
import { cannotTriggerAbilities } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ShinjoScout2 extends DrawCard {
    static id = 'shinjo-scout-2';

    setupCardAbilities() {
        this.interrupt('Cancel the province effect')
            .when({
                onCardRevealed: (event, context) =>
                    event.card.type === CardType.Province && context.source.isAttacking()
            })
            .selectCard({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince(),
                message: (context, cards) => msg`${context.player} prevents ${cards} from triggering its abilities during this conflict`,
                gameAction: cardLastingEffect({
                    targetLocation: Location.Provinces,
                    effect: cannotTriggerAbilities()
                })
            })
            .chatText('avoid the dangers of their exploration');
    }
}
