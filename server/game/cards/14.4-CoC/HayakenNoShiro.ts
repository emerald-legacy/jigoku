import { CardType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { ready } from '../../GameActions/GameActions.js';

export default class HayakenNoShiro extends StrongholdCard {
    static id = 'hayaken-no-shiro';

    setupCardAbilities() {
        this.action('Ready a character')
            .cost(AbilityDsl.costs.bowSelf())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('bushi') && card.costLessThan(3)
            }, ready());
    }
}
