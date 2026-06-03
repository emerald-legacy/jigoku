import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';

class SneakyShinjo extends DrawCard {
    static id = 'sneaky-shinjo';

    setupCardAbilities() {
        this.reaction({
            title: 'Play this character',
            location: Location.Provinces,
            when: {
                onPassDuringDynasty: (event, context) => event.player === context.player
            },
            effect: 'play {0}',
            gameAction: AbilityDsl.actions.playCard({ location: Location.ProvinceOne, source: this })
        });
    }
}


export default SneakyShinjo;
