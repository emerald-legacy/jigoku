import DrawCard from '../../drawcard.js';
import { Players } from '../../Constants.js';

class GuestOfHonor extends DrawCard {
    static id = 'guest-of-honor';

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Opponent,
            effect: ability.effects.playerCannot({
                cannot: 'play',
                restricts: 'events'
            })
        });
    }
}


export default GuestOfHonor;
