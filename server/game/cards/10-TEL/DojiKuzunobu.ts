import DrawCard from '../../DrawCard.js';
import { playerCannot } from '../../effects.js';
import { Players, RestrictionType } from '../../Constants.js';

class DojiKuzuNobu extends DrawCard {
    static id = 'doji-kuzunobu';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            targetController: Players.Any,
            effect: playerCannot({
                cannot: RestrictionType.TriggerAbilities,
                restricts: 'reactions'
            })
        });
    }
}


export default DojiKuzuNobu;
