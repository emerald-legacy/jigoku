import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { deckSearch, moveCard } from '../../GameActions/GameActions.js';

class TatteredMissive extends DrawCard {
    static id = 'tattered-missive';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: 'courtier'
        });

        this.action('Search top 5 cards')
            .cost(AbilityDsl.costs.bowParent())
            .condition(context => context.player.conflictDeck.length > 0)
            .gameAction(deckSearch({
                amount: 5,
                gameAction: moveCard({
                    destination: Location.Hand
                })
            }))
            .effect('look at the top 5 cards of their conflict deck');
    }
}


export default TatteredMissive;
