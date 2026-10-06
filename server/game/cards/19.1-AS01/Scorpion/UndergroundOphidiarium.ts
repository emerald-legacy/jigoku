import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { deckSearch, moveCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class UndergroundOphidiarium extends DrawCard {
    static id = 'underground-ophidiarium';

    public setupCardAbilities() {
        this.action('Search for a Poison')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .gameAction(deckSearch({
                cardCondition: (card) => card.type === CardType.Attachment && card.hasTrait('poison'),
                gameAction: moveCard({ destination: Location.Hand })
            }))
            .effect('search conflict deck to reveal a poison attachment and add it to their hand');
    }
}
