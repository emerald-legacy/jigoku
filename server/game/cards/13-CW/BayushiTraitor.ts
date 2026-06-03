import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class BayushiTraitor extends DrawCard {
    static id = 'bayushi-traitor';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            condition: context => context.player.opponent !== undefined && context.source.controller !== context.source.owner,
            effect: [
                AbilityDsl.effects.cannotParticipateAsAttacker(),
                AbilityDsl.effects.cannotParticipateAsDefender()
            ]
        });

        this.persistentEffect({
            location: Location.Any,
            targetLocation: Location.Any,
            effect: AbilityDsl.effects.cardCannot('putIntoConflict')
        });

        this.persistentEffect({
            location: Location.Any,
            targetLocation: Location.Any,
            effect: AbilityDsl.effects.entersPlayForOpponent()
        });
    }
}


export default BayushiTraitor;
