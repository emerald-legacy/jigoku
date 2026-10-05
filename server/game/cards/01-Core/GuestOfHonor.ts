import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class GuestOfHonor extends DrawCard {
    static id = 'guest-of-honor';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'play',
                restricts: 'events'
            })
        });
    }
}


export default GuestOfHonor;
