import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';

class GiftedTactician extends DrawCard {
    static id = 'gifted-tactician';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating() &&
                                                   event.conflict.conflictType === ConflictType.Military
            })
            .draw();
    }
}


export default GiftedTactician;
