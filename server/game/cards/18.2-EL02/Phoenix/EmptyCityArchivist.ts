import DrawCard from '../../../DrawCard.js';
import { moveCard } from '../../../GameActions/GameActions.js';
import { Location } from '../../../Constants.js';

class EmptyCityArchivist extends DrawCard {
    static id = 'empty-city-archivist';

    setupCardAbilities() {
        this.reaction('Search your deck for a card')
            .when({
                onCardAttached: (event, context) => event.card === context.source && event.originalLocation !== Location.PlayArea
            })
            .deckSearch({
                cardsToLookAt: 4,
                cardCondition: (card, context) => {
                    const parent = context.source.parentCharacter;
                    return card.hasTrait('spell') || card.hasTrait('kiho') || (!!parent && parent.hasTrait('scholar'));
                },
                placeOnBottomInRandomOrder: true,
                shuffle: false,
                gameAction: moveCard({
                    destination: Location.Hand
                })
            });
    }
}


export default EmptyCityArchivist;
