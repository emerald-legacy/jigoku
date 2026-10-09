import DrawCard from '../../DrawCard.js';
import { Players, RestrictionType } from '../../Constants.js';
import { playerCannot } from '../../effects.js';

class GuestOfHonor extends DrawCard {
    static id = 'guest-of-honor';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            targetController: Players.Opponent,
            effect: playerCannot({
                cannot: RestrictionType.Play,
                restricts: 'events'
            })
        });
    }
}


export default GuestOfHonor;
