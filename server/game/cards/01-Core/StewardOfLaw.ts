import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class StewardOfLaw extends DrawCard {
    static id = 'steward-of-law';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            match: card => card.getType() === CardTypes.Character,
            effect: ability.effects.cardCannot('receiveDishonorToken')
        });
    }
}


export default StewardOfLaw;

