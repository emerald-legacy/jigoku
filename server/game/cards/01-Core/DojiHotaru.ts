import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { ConflictType } from '../../Constants.js';

class DojiHotaru extends DrawCard {
    static id = 'doji-hotaru';

    setupCardAbilities() {
        this.reaction('Resolve ring effect')
            .when({
                onClaimRing: (event, context) => this.game.isDuringConflict(ConflictType.Political) && context.source.isParticipating() &&
                                                 event.player === context.player
            })
            .gameAction(AbilityDsl.actions.resolveConflictRing());
    }
}


export default DojiHotaru;
