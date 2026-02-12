import { CardTypes, Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class UndergroundOphidiarium extends DrawCard {
    static id = 'underground-ophidiarium';

    public setupCardAbilities() {
        this.action({
            title: 'Search for a Poison',
            effect: 'search conflict deck to reveal a poison attachment and add it to their hand',
            cost: AbilityDsl.costs.sacrificeSelf(),
            gameAction: AbilityDsl.actions.deckSearch({
                cardCondition: (card) => card.type === CardTypes.Attachment && card.hasTrait('poison'),
                gameAction: AbilityDsl.actions.moveCard({ destination: Locations.Hand })
            })
        });
    }
}
