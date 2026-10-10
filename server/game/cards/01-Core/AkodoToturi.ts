import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';

class AkodoToturi extends DrawCard {
    static id = 'akodo-toturi';

    setupCardAbilities() {
        this.reaction('Resolve ring effect')
            .when({
                onClaimRing: (event, context) => this.game.isDuringConflict(ConflictType.Military) && context.source.isParticipating() &&
                                                 event.player === context.player
            })
            .resolveConflictRing();
    }
}


export default AkodoToturi;
