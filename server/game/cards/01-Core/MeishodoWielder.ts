import { reduceCost } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';

class MeishodoWielder extends DrawCard {
    static id = 'meishodo-wielder';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            condition: (context) => this.game.getFirstPlayer() === context.player,
            effect: reduceCost({
                match: (card, source) => card === source
            })
        });
    }
}


export default MeishodoWielder;
