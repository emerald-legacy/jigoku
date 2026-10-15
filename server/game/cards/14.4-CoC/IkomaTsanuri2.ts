import DrawCard from '../../DrawCard.js';
import { Players, RestrictionType, RestrictionScope } from '../../Constants.js';
import { playerCannot } from '../../effects.js';

class IkomaTsanuri2 extends DrawCard {
    static id = 'ikoma-tsanuri-2';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            targetController: Players.Opponent,
            effect: playerCannot({
                cannot: RestrictionType.TriggerAbilities,
                appliesTo: RestrictionScope.AttackedProvinceNonForced
            })
        });
    }
}


export default IkomaTsanuri2;
