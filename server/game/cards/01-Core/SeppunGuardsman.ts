import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SeppunGuardsman extends DrawCard {
    static id = 'seppun-guardsman';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            location: Location.Any,
            condition: context => !!context.player.opponent && context.player.opponent.imperialFavor !== '',
            effect: ability.effects.cannotParticipateAsAttacker()
        });
    }
}


export default SeppunGuardsman;
