import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import { playCard } from '../../GameActions/GameActions.js';

class GuidanceOfTheAncestors extends DrawCard {
    static id = 'guidance-of-the-ancestors';

    setupCardAbilities() {
        this.action('Play this from the discard pile')
            .gameAction(playCard({
                source: this
            }))
            .location(Location.ConflictDiscardPile);
    }
}


export default GuidanceOfTheAncestors;
