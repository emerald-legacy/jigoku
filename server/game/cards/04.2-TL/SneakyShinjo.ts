import { playCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';

class SneakyShinjo extends DrawCard {
    static id = 'sneaky-shinjo';

    setupCardAbilities() {
        this.reaction('Play this character')
            .when({
                onPassDuringDynasty: (event, context) => event.player === context.player
            })
            .gameAction(playCard({ location: Location.ProvinceOne, source: this }))
            .chatText('play {0}')
            .location(Location.Provinces);
    }
}


export default SneakyShinjo;
