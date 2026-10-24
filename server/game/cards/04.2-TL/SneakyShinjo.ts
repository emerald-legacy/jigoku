import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';

class SneakyShinjo extends DrawCard {
    static id = 'sneaky-shinjo';

    override setupCardAbilities() {
        this.reaction('Play this character')
            .when({
                onPassDuringDynasty: (event, context) => event.player === context.player
            })
            .location(Location.Provinces)
            .playCard({ source: this })
            .chatText('play {0}');
    }
}


export default SneakyShinjo;
