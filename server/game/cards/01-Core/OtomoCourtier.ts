import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class OtomoCourtier extends DrawCard {
    static id = 'otomo-courtier';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            location: Location.Any,
            condition: context => !!context.player.opponent && context.player.opponent.imperialFavor !== '',
            effect: ability.effects.cannotParticipateAsAttacker()
        });
    }
}


export default OtomoCourtier;
