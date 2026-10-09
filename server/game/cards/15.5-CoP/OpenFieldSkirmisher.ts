import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class OpenFieldSkirmisher extends DrawCard {
    static id = 'open-field-skirmisher';

    setupCardAbilities() {
        this.action('Reduce Province Strength')
            .cost(costs.removeFateFromSelf())
            .condition((context) => context.source.isAttacking())
            .selectCard({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince(),
                message: (context, cards) => msg`${context.player} reduces the strength of ${cards} by 3`,
                gameAction: cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: modifyProvinceStrength(-3)
                }))
            })
            .chatText('reduce the strength of an attacked province by 3');
    }
}


export default OpenFieldSkirmisher;
