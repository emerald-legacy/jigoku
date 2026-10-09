import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';

class BlackmailArtist extends DrawCard {
    static id = 'blackmail-artist';

    setupCardAbilities() {
        this.reaction('Take 1 honor')
            .when({
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.source.controller &&
                                                   context.player.opponent && event.conflict.conflictType === ConflictType.Political
            })
            .takeHonor();
    }
}


export default BlackmailArtist;
