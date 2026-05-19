import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players } from '../../Constants.js';

class DojiKuzuNobu extends DrawCard {
    static id = 'doji-kuzunobu';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            targetController: Players.Any,
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'triggerAbilities',
                restricts: 'reactions'
            })
        });
    }
}


export default DojiKuzuNobu;
