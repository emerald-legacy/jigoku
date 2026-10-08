import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import { moveCard } from '../../GameActions/GameActions.js';

class ShibaSophist extends DrawCard {
    static id = 'shiba-sophist';

    setupCardAbilities() {
        this.action('Search top 5 cards for a card with the contested ring trait')
            .condition(context => context.source.isParticipating())
            .deckSearch({
                cardsToLookAt: 5,
                cardCondition: card => this.game.currentConflict?.elements.some(element => card.hasTrait(element)) ?? false,
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .chatText('look at the top five cards of their deck');
    }
}


export default ShibaSophist;

