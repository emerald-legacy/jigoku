import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class StewardOfLaw extends DrawCard {
    static id = 'steward-of-law';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            match: card => card.getType() === CardType.Character,
            effect: ability.effects.cardCannot('receiveDishonorToken')
        });
    }
}


export default StewardOfLaw;

