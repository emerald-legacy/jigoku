import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';

class AkodoToturi extends DrawCard {
    static id = 'akodo-toturi';

    override setupCardAbilities() {
        this.reaction('Resolve ring effect')
            .when({
                onClaimRing: (event, context) => this.game.isDuringConflict(ConflictType.Military) && context.source.isParticipating() &&
                                                 event.player === context.player
            })
            .resolveConflictRing((context) => ({ target: context.event.ring }));
    }
}


export default AkodoToturi;
