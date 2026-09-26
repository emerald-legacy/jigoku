import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class VengefulOathkeeper extends DrawCard {
    static id = 'vengeful-oathkeeper';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Put this into play')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player &&
                                                   event.conflict.conflictType === 'military'
            })
            .gameAction(ability.actions.putIntoPlay())
            .location(Location.Hand);
    }
}


export default VengefulOathkeeper;

