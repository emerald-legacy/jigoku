import DrawCard from '../../drawcard.js';
import { Locations } from '../../Constants.js';

class GuidanceOfTheAncestors extends DrawCard {
    static id = 'guidance-of-the-ancestors';

    setupCardAbilities(ability) {
        this.action({
            title: 'Play this from the discard pile',
            location: Locations.ConflictDiscardPile,
            gameAction: ability.actions.playCard({
                source: this
            })
        });
    }
}


export default GuidanceOfTheAncestors;
