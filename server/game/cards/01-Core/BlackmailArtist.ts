import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';

class BlackmailArtist extends DrawCard {
    static id = 'blackmail-artist';

    override setupCardAbilities() {
        this.reaction('Take 1 honor')
            .when({
                afterConflict: (event, context) => event.conflict.isOnWinningSide(context.source) &&
                                                   context.player.opponent && event.conflict.conflictType === ConflictType.Political
            })
            .takeHonor();
    }
}


export default BlackmailArtist;
