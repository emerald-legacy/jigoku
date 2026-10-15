import { CardType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { ready } from '../../GameActions/GameActions.js';

export default class HayakenNoShiro extends StrongholdCard {
    static id = 'hayaken-no-shiro';

    setupCardAbilities() {
        this.action('Ready a character')
            .cost(costs.bowSelf())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('bushi') && card.costLessThan(3)
            }, ready());
    }
}
