import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { cannotReceiveDishonorToken } from '../../effects.js';

class StewardOfLaw extends DrawCard {
    static id = 'steward-of-law';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            match: card => card.getType() === CardType.Character,
            effect: cannotReceiveDishonorToken()
        });
    }
}


export default StewardOfLaw;

