import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class StewardOfLaw extends DrawCard {
    static id = 'steward-of-law';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            match: card => card.getType() === CardType.Character,
            effect: AbilityDsl.effects.cannotReceiveDishonorToken()
        });
    }
}


export default StewardOfLaw;

