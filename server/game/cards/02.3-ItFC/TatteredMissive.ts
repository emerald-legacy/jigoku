import DrawCard from '../../DrawCard.js';
import { Location, Trait } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { moveCard } from '../../GameActions/GameActions.js';

class TatteredMissive extends DrawCard {
    static id = 'tattered-missive';

    override setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: Trait.Courtier
        });

        this.action('Search top 5 cards')
            .condition((context) => context.player.conflictDeck.length > 0)
            .cost(costs.bowParent())
            .deckSearch({
                cardsToLookAt: 5,
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .chatText('look at the top 5 cards of their conflict deck');
    }
}


export default TatteredMissive;
