import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Locations } from '../../Constants.js';

class SneakyShinjo extends DrawCard {
    static id = 'sneaky-shinjo';

    setupCardAbilities() {
        this.reaction({
            title: 'Play this character',
            location: Locations.Provinces,
            when: {
                onPassDuringDynasty: (event, context) => event.player === context.player
            },
            effect: 'play {0}',
            gameAction: AbilityDsl.actions.playCard({ location: Locations.ProvinceOne, source: this })
        });
    }
}


export default SneakyShinjo;
