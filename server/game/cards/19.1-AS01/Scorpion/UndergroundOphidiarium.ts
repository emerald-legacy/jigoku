import { CardType, Location } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { moveCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class UndergroundOphidiarium extends DrawCard {
    static id = 'underground-ophidiarium';

    public setupCardAbilities() {
        this.action('Search for a Poison')
            .cost(costs.sacrificeSelf())
            .deckSearch({
                cardCondition: (card) => card.type === CardType.Attachment && card.hasTrait('poison'),
                gameAction: moveCard({ destination: Location.Hand })
            })
            .effect('search conflict deck to reveal a poison attachment and add it to their hand');
    }
}
