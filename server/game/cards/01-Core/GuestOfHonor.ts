import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import { playerCannot } from '../../effects.js';

class GuestOfHonor extends DrawCard {
    static id = 'guest-of-honor';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            targetController: Players.Opponent,
            effect: playerCannot({
                cannot: 'play',
                restricts: 'events'
            })
        });
    }
}


export default GuestOfHonor;
