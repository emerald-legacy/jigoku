import DrawCard from '../../DrawCard.js';
import { Location, elementTrait } from '../../Constants.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';
import { topCards } from '../topCards.js';

class ShibaSophist extends DrawCard {
    static id = 'shiba-sophist';

    override setupCardAbilities() {
        this.action('Search top 5 cards for a card with the contested ring trait')
            .condition((context) => context.source.isParticipating())
            .deckSearch({
                cardsToLookAt: 5,
                cardCondition: (card) => this.game.currentConflict?.elements.some((element) => card.hasTrait(elementTrait(element))) ?? false,
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .chatText((context) => msg`look at the ${topCards(5, context.player.conflictDeck.length, true)} of their deck`);
    }
}


export default ShibaSophist;

