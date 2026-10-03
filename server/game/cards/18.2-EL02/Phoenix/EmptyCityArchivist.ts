import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Location } from '../../../Constants.js';

class SearchTheArchives extends DrawCard {
    static id = 'empty-city-archivist';

    setupCardAbilities() {
        this.reaction('Search your deck for a card')
            .when({
                onCardAttached: (event, context) => event.card === context.source && event.originalLocation !== Location.PlayArea
            })
            .gameAction(AbilityDsl.actions.deckSearch({
                amount: 4,
                cardCondition: (card, context) => {
                    const parent = context.source.parentCharacter;
                    return card.hasTrait('spell') || card.hasTrait('kiho') || (!!parent && parent.hasTrait('scholar'));
                },
                placeOnBottomInRandomOrder: true,
                shuffle: false,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Location.Hand
                })
            }));
    }
}


export default SearchTheArchives;
