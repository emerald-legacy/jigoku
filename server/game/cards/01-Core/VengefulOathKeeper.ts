import DrawCard from '../../DrawCard.js';
import { Location, ConflictType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class VengefulOathkeeper extends DrawCard {
    static id = 'vengeful-oathkeeper';

    setupCardAbilities() {
        this.reaction('Put this into play')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player &&
                                                   event.conflict.conflictType === ConflictType.Military
            })
            .gameAction(AbilityDsl.actions.putIntoPlay())
            .location(Location.Hand);
    }
}


export default VengefulOathkeeper;

