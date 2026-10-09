import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { ready } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class AsceticVisionary extends DrawCard {
    static id = 'ascetic-visionary';

    setupCardAbilities() {
        this.action('Ready a character')
            .cost(costs.payFateToRing(1))
            .condition((context) => context.source.isAttacking())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) =>
                    card.hasTrait('monk') || card.attachments.some((card) => card.hasTrait('monk'))
            }, ready());
    }
}
