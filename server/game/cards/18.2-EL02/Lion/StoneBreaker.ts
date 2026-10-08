import DrawCard from '../../../DrawCard.js';
import { CardType, Location } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { modifyProvinceStrength } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { moveCardInProvinceAction } from '../../moveCardInProvince.js';

class StoneBreaker extends DrawCard {
    static id = 'stone-breaker';

    setupCardAbilities() {
        moveCardInProvinceAction(this)
            .cost(costs.sacrificeSelf())
            .refillFaceup(context => ({ location: context.cardStateWhenInitiated?.location ?? [] }));

        this.conflictAction('Reduce province strength')
            .selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince() && card.isProvinceCard() && card.getStrength() > 0,
                message: '{0} reduces the strength of {1} by 2',
                messageArgs: cards => [context.player, cards],
                gameAction: cardLastingEffect({
                    targetLocation: Location.Provinces,
                    effect: modifyProvinceStrength(-2)
                })
            }))
            .chatText('reduce an attacked province strength by 2');
    }
}


export default StoneBreaker;
