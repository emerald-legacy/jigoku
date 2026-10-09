import DrawCard from '../../DrawCard.js';
import { resolveConflictRing } from '../../GameActions/GameActions.js';
import { ConflictType } from '../../Constants.js';

class DojiHotaru extends DrawCard {
    static id = 'doji-hotaru';

    setupCardAbilities() {
        this.reaction('Resolve ring effect')
            .when({
                onClaimRing: (event, context) => this.game.isDuringConflict(ConflictType.Political) && context.source.isParticipating() &&
                                                 event.player === context.player
            })
            .gameAction(resolveConflictRing());
    }
}


export default DojiHotaru;
