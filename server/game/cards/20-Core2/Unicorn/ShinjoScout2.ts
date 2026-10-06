import { CardType, Location } from '../../../Constants.js';
import { cannotTriggerAbilities } from '../../../effects.js';
import { cardLastingEffect, selectCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ShinjoScout2 extends DrawCard {
    static id = 'shinjo-scout-2';

    setupCardAbilities() {
        this.interrupt('Cancel the province effect')
            .when({
                onCardRevealed: (event, context) =>
                    event.card.type === CardType.Province && context.source.isAttacking()
            })
            .gameAction(selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince(),
                message: '{0} prevents {1} from triggering its abilities during this conflict',
                messageArgs: (cards) => [context.player, cards],
                gameAction: cardLastingEffect({
                    targetLocation: Location.Provinces,
                    effect: cannotTriggerAbilities()
                })
            })))
            .effect('avoid the dangers of their exploration');
    }
}
