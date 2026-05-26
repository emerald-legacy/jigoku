import DrawCard from '../../drawcard.js';
import { Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class VengefulOathkeeper extends DrawCard {
    static id = 'vengeful-oathkeeper';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Put this into play',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player &&
                                                   event.conflict.conflictType === 'military'
            },
            location: Locations.Hand,
            gameAction: ability.actions.putIntoPlay()
        });
    }
}


export default VengefulOathkeeper;

