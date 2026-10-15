import DrawCard from '../../DrawCard.js';
import { Location, ConflictType } from '../../Constants.js';

class VengefulOathkeeper extends DrawCard {
    static id = 'vengeful-oathkeeper';

    override setupCardAbilities() {
        this.reaction('Put this into play')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player &&
                                                   event.conflict.conflictType === ConflictType.Military
            })
            .location(Location.Hand)
            .putIntoPlay();
    }
}


export default VengefulOathkeeper;

