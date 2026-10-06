import DrawCard from '../../DrawCard.js';
import { playerCannot } from '../../effects.js';
import { Players } from '../../Constants.js';

class DojiKuzuNobu extends DrawCard {
    static id = 'doji-kuzunobu';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            targetController: Players.Any,
            effect: playerCannot({
                cannot: 'triggerAbilities',
                restricts: 'reactions'
            })
        });
    }
}


export default DojiKuzuNobu;
