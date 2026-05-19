import DrawCard from '../../drawcard.js';
import { Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TatteredMissive extends DrawCard {
    static id = 'tattered-missive';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: 'courtier'
        });

        this.action({
            title: 'Search top 5 cards',
            condition: context => context.player.conflictDeck.length > 0,
            cost: AbilityDsl.costs.bowParent(),
            effect: 'look at the top 5 cards of their conflict deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 5,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });
    }
}


export default TatteredMissive;
