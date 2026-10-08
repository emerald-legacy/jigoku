import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import {
    cannotParticipateAsAttacker,
    cannotParticipateAsDefender,
    cardCannot,
    entersPlayForOpponent
} from '../../effects.js';

class BayushiTraitor extends DrawCard {
    static id = 'bayushi-traitor';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            condition: (context) => context.player.opponent !== undefined && context.source.controller !== context.source.owner,
            effect: [
                cannotParticipateAsAttacker(),
                cannotParticipateAsDefender()
            ]
        });

        this.persistentEffect({
            location: Location.Any,
            targetLocation: Location.Any,
            effect: cardCannot('putIntoConflict')
        });

        this.persistentEffect({
            location: Location.Any,
            targetLocation: Location.Any,
            effect: entersPlayForOpponent()
        });
    }
}


export default BayushiTraitor;
