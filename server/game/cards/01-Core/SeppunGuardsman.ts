import DrawCard from '../../drawcard.js';
import { Locations } from '../../Constants.js';

class SeppunGuardsman extends DrawCard {
    static id = 'seppun-guardsman';

    setupCardAbilities(ability) {
        this.persistentEffect({
            location: Locations.Any,
            condition: context => context.player.opponent && context.player.opponent.imperialFavor !== '',
            effect: ability.effects.cannotParticipateAsAttacker()
        });
    }
}


export default SeppunGuardsman;
