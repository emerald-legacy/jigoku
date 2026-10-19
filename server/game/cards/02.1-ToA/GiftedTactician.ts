import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';

class GiftedTactician extends DrawCard {
    static id = 'gifted-tactician';

    override setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                afterConflict: (event, context) => event.conflict.isOnWinningSide(context.source) &&
                                                   event.conflict.conflictType === ConflictType.Military
            })
            .draw();
    }
}


export default GiftedTactician;
