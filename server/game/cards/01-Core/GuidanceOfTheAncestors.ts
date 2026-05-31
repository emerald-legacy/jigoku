import DrawCard from '../../DrawCard.js';
import { Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class GuidanceOfTheAncestors extends DrawCard {
    static id = 'guidance-of-the-ancestors';

    setupCardAbilities(ability: typeof AbilityDsl) {
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
